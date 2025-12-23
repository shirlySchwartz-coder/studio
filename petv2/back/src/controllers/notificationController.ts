import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../models/UserInfo";
import db from '../Dal/dal_mysql';

// קבלת כל ההתראות של משתמש
export const getUserNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const user_id = req.user.userId;
    const { limit = 50, offset = 0 } = req.query;

    const sql = `
      SELECT 
        id,
        notification_type,
        title,
        message,
        related_entity_type,
        related_entity_id,
        is_read,
        read_at,
        priority,
        action_url,
        created_at
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const notifications = await db.execute(sql, [
      user_id,
      parseInt(limit as string),
      parseInt(offset as string),
    ]);

    return notifications;
  } catch (err: any) {
    console.error('Error fetching notifications:', err);
    throw err;
  }
};

// קבלת מספר ההתראות שלא נקראו
export const getUnreadCount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const user_id = req.user.userId;

    const sql = `
      SELECT COUNT(*) as unread_count
      FROM notifications
      WHERE user_id = ? AND is_read = 0
    `;

    const result = await db.execute<any[]>(sql, [user_id]);
    return { unread_count: result[0]?.unread_count || 0 };
  } catch (err: any) {
    console.error('Error fetching unread count:', err);
    throw err;
  }
};

// סימון התראה כנקראה
export const markAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const notificationId = parseInt(req.params.id);
    if (isNaN(notificationId)) {
      throw new Error('Invalid notification ID');
    }

    const user_id = req.user.userId;

    // וידוא שההתראה שייכת למשתמש
    const checkSql = `
      SELECT id FROM notifications 
      WHERE id = ? AND user_id = ?
    `;
    const notifications = await db.execute<any[]>(checkSql, [
      notificationId,
      user_id,
    ]);

    if (notifications.length === 0) {
      throw new Error('Notification not found or access denied');
    }

    // עדכון ההתראה
    const updateSql = `
      UPDATE notifications 
      SET is_read = 1, read_at = NOW()
      WHERE id = ? AND user_id = ?
    `;

    await db.execute(updateSql, [notificationId, user_id]);

    return { message: 'Notification marked as read' };
  } catch (err: any) {
    console.error('Error marking notification as read:', err);
    throw err;
  }
};

// סימון כל ההתראות כנקראו
export const markAllAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const user_id = req.user.userId;

    const updateSql = `
      UPDATE notifications 
      SET is_read = 1, read_at = NOW()
      WHERE user_id = ? AND is_read = 0
    `;

    const result = await db.execute<any>(updateSql, [user_id]);

    return {
      message: 'All notifications marked as read',
      updated_count: result.affectedRows || 0,
    };
  } catch (err: any) {
    console.error('Error marking all notifications as read:', err);
    throw err;
  }
};

// מחיקת התראה
export const deleteNotification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const notificationId = parseInt(req.params.id);
    if (isNaN(notificationId)) {
      throw new Error('Invalid notification ID');
    }

    const user_id = req.user.userId;

    // וידוא שההתראה שייכת למשתמש
    const checkSql = `
      SELECT id FROM notifications 
      WHERE id = ? AND user_id = ?
    `;
    const notifications = await db.execute<any[]>(checkSql, [
      notificationId,
      user_id,
    ]);

    if (notifications.length === 0) {
      throw new Error('Notification not found or access denied');
    }

    // מחיקת ההתראה
    const deleteSql = `
      DELETE FROM notifications 
      WHERE id = ? AND user_id = ?
    `;

    await db.execute(deleteSql, [notificationId, user_id]);

    return { message: 'Notification deleted successfully' };
  } catch (err: any) {
    console.error('Error deleting notification:', err);
    throw err;
  }
};

// קבלת התראות לפי סוג
export const getNotificationsByType = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const user_id = req.user.userId;
    const { type } = req.params;

    const validTypes = [
      'adoption_request_submitted',
      'adoption_request_approved',
      'adoption_request_rejected',
      'adoption_request_under_review',
      'animal_approved',
      'animal_rejected',
      'comment_reply',
      'favorite_animal_adopted',
      'system_announcement',
    ];

    if (!validTypes.includes(type)) {
      throw new Error('Invalid notification type');
    }

    const sql = `
      SELECT 
        id,
        notification_type,
        title,
        message,
        related_entity_type,
        related_entity_id,
        is_read,
        read_at,
        priority,
        action_url,
        created_at
      FROM notifications
      WHERE user_id = ? AND notification_type = ?
      ORDER BY created_at DESC
    `;

    const notifications = await db.execute(sql, [user_id, type]);
    return notifications;
  } catch (err: any) {
    console.error('Error fetching notifications by type:', err);
    throw err;
  }
};