import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../models/UserInfo';
import db from '../Dal/dal_mysql';

//יצירת בקשת אימות חדשה
export const createAdoptionRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { animalId, message } = req.body;
    const userId = req.user?.userId;
    if (!animalId) {
      throw new Error('Animal Id is required');
    }
    if (!req.user || req.user.roleId !== 3) {
      throw new Error('Only regular users can submit adoption requests');
    }

    // בדיקה שהחיה קיימת וזמינה לאימוץ
    const animalCheckSql = `
      SELECT id, name, status_id, shelter_id FROM animals 
      WHERE id = ?`;
    const animals = await db.execute<any[]>(animalCheckSql, [animalId]);

    if (animals.length === 0) {
      throw new Error('Animal not found');
    }
    const animal = animals[0];
    // בדיקה שהחיה זמינה (status_id = 1 = Available)
    if (animal.status_id !== 1) {
      throw new Error('Animal is not available for adoption');
    }

    // בדיקה אם כבר קיימת בקשה פעילה למשתמש זה ולחיה זו
    const existingRequestSql = `
      SELECT id, status_id 
      FROM adoption_requests 
      WHERE user_id = ? AND animal_id = ? AND status_id = 1`;
    const existingRequests = await db.execute<any[]>(existingRequestSql, [
      userId,
      animalId,
    ]);

    if (existingRequests.length > 0) {
      throw new Error('You already have a pending request for this animal');
    }

    // יצירת בקשת האימוץ
    const insertSql = `
      INSERT INTO adoption_requests (
        user_id, animal_id, message, status_id, created_at
      ) VALUES (?, ?, ?, 1, NOW())
    `;

    const result = await db.execute<{ insertId: number }>(insertSql, [
      userId,
      animalId,
      message || null,
    ]);

    const request_id = result.insertId;

    // יצירת התראה למנהל המקלט
    const shelterManagerSql = `
      SELECT id, full_name 
      FROM users 
      WHERE shelter_id = ? AND role_id = 2 
      LIMIT 1
    `;
    const managers = await db.execute<any[]>(shelterManagerSql, [
      animal.shelter_id,
    ]);

    if (managers.length > 0) {
      const manager = managers[0];
      const notificationSql = `
        INSERT INTO notifications (
          user_id, notification_type, title, message, 
          related_entity_type, related_entity_id, 
          priority, action_url, sent_by_user_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      await db.execute(notificationSql, [
        manager.id,
        'adoption_request_submitted',
        'New Adoption Request',
        `${req.user.fullName} has submitted an adoption request for ${animal.name}`,
        'adoption_request',
        request_id,
        'high',
        `/adoption-requests/${request_id}`,
        userId,
      ]);
    }

    return {
      message: 'Adoption request submitted successfully',
      request_id: request_id,
    };
  } catch (error: any) {
    console.error('Error creating adoption request:', error);
    throw error;
  }
};
// קבלת כל בקשות האימוץ של משתמש
export const getUserAdoptionRequests = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID is required');
    }
    const sql = `
      SELECT 
        Ar.id,
        Ar.animal_id,
        A.name AS animal_name,
        A.image_url AS animal_image,
        Sp.name AS species,
        Ar.message,
       Rs.name AS status,
        Ar.status_id,
        Ar.admin_notes,
        Ar.created_at,
        Ar.updated_at,
        S.name AS shelter_name
      FROM adoption_requests ar
      INNER JOIN animals A ON Ar.animal_id = A.id
      INNER JOIN species Sp ON A.species_id = Sp.id
      INNER JOIN request_statuses Rs ON Ar.status_id = Rs.id
      INNER JOIN shelters S ON a.shelter_id = S.id
      WHERE Ar.user_id = ?
      ORDER BY ar.created_at DESC
    `;
    const requests = await db.execute(sql, [userId]);
    return requests;
  } catch (err: any) {
    console.error('Error fetching user adoption requests:', err);
    throw err;
  }
};

// קבלת בקשות אימוץ לפי מקלט (למנהלי מקלט)
export const getShelterAdoptionRequests = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.roleId > 2) {
      throw new Error('No permissions to view shelter adoption requests');
    }
    const shelterId = req.params?.shelterId || req.user.shelterId;
    if (!shelterId) {
      throw new Error('Shelter ID not found');
    }
    const sql = `
      SELECT 
        Ar.id,
        Ar.animal_id,
        A.name AS animal_name,
        A.image_url AS animal_image,
        Sp.name AS species,
        U.full_name AS applicant_name,
        U.email AS applicant_email,
        U.phone AS applicant_phone,
        U.city AS applicant_city,
        Ar.message,
        Rs.name AS status,
        Ar.status_id,
        Ar.admin_notes,
        Ar.created_at,
        Ar.updated_at
      FROM adoption_requests ar
      INNER JOIN animals A ON Ar.animal_id = A.id
      INNER JOIN species Sp ON A.species_id = Sp.id
      INNER JOIN users U ON Ar.user_id = U.id
      INNER JOIN request_statuses Rs ON Ar.status_id = rs.id
      WHERE A.shelter_id = ?
      ORDER BY ar.created_at DESC
    `;
    const requests = await db.execute(sql, [shelterId]);
    return requests;
  } catch (err: any) {
    console.error('Error fetching shelter adoption requests:', err);
    throw err;
  }
};

// קבלת ספירת בקשות ממתינות (למנהלי מקלט)
export const getPendingRequestsCount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.roleId > 2) {
      throw new Error('No permissions to view pending requests count');
    }

    const shelterId = req.user.shelterId;
    if (!shelterId) {
      throw new Error('Shelter ID not found');
    }

    const sql = `
      SELECT COUNT(*) as pending_count
      FROM adoption_requests Ar
      INNER JOIN animals A ON Ar.animal_id = A.id
      WHERE A.shelter_id = ? AND Ar.status_id = 1
    `;

    const result = await db.execute<any[]>(sql, [shelterId]);
    return { pending_count: result[0]?.pending_count || 0 };
  } catch (err: any) {
    console.error('Error fetching pending requests count:', err);
    throw err;
  }
};

// אישור בקשת אימוץ (מנהל מקלט)
export const approveAdoptionRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.roleId > 2) {
      throw new Error('No permissions to approve adoption requests');
    }

    const requestId = parseInt(req.params.id);
    if (isNaN(requestId)) {
      throw new Error('Invalid request ID');
    }

    const { admin_notes } = req.body;

    // קבלת פרטי הבקשה
    const getRequestSql = `
      SELECT Ar.id, ar.user_id, Ar.animal_id, Ar.status_id,
	A.name AS animal_name, A.shelter_id,
	U.full_name AS user_name
	FROM adoption_requests ar
	INNER JOIN animals A ON Ar.animal_id = A.id
	INNER JOIN users U ON Ar.user_id = U.id
	WHERE Ar.id = ?
    `;

    const requests = await db.execute<any[]>(getRequestSql, [requestId]);

    if (requests.length === 0) {
      throw new Error('Adoption request not found');
    }

    const request = requests[0];

    // וידוא שהמנהל שייך למקלט הנכון
    if (request.shelter_id !== req.user.shelterId) {
      throw new Error('No permissions to approve this request');
    }

    // וידוא שהבקשה במצב ממתין
    if (request.status_id !== 1) {
      throw new Error('Request is not pending');
    }

    // עדכון הבקשה לאושרה
    const updateSql = `
      UPDATE adoption_requests 
      SET status_id = 2, 
          admin_notes = ?,
          reviewed_by_user_id = ?,
          updated_at = NOW()
      WHERE id = ?
    `;

    await db.execute(updateSql, [
      admin_notes || null,
      req.user.userId,
      requestId,
    ]);

    // עדכון סטטוס החיה ל-Adopted (status_id = 2)
    const updateAnimalSql = `
      UPDATE animals 
      SET status_id = 2, updated_at = NOW()
      WHERE id = ?
    `;

    await db.execute(updateAnimalSql, [request.animal_id]);

    // יצירת התראה למשתמש
    const notificationSql = `
      INSERT INTO notifications (
        user_id, notification_type, title, message,
        related_entity_type, related_entity_id,
        priority, action_url, sent_by_user_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    await db.execute(notificationSql, [
      request.user_id,
      'adoption_request_approved',
      'Adoption Request Approved! 🎉',
      `Congratulations! Your adoption request for ${
        request.animal_name
      } has been approved. ${admin_notes || ''}`,
      'adoption_request',
      requestId,
      'high',
      `/my-requests/${requestId}`,
      req.user.userId,
    ]);

    // התראה למשתמשים שהוסיפו את החיה למועדפים
    const favoriteSql = `
      INSERT INTO notifications (
        user_id, notification_type, title, message,
        related_entity_type, related_entity_id,
        priority, created_at
      )
      SELECT 
        uf.user_id,
        'favorite_animal_adopted',
        'Favorite Animal Adopted',
        CONCAT('${request.animal_name} from your favorites has been adopted by another user.'),
        'animal',
        uf.animal_id,
        'normal',
        NOW()
      FROM user_favorites uf
      WHERE uf.animal_id = ? AND uf.user_id != ?
    `;

    await db.execute(favoriteSql, [request.animal_id, request.user_id]);

    return { message: 'Adoption request approved successfully' };
  } catch (err: any) {
    console.error('Error approving adoption request:', err);
    throw err;
  }
};

// דחיית בקשת אימוץ (מנהל מקלט)
export const rejectAdoptionRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.roleId > 2) {
      throw new Error('No permissions to reject adoption requests');
    }

    const requestId = parseInt(req.params.id);
    if (isNaN(requestId)) {
      throw new Error('Invalid request ID');
    }

    const { admin_notes } = req.body;

    if (!admin_notes) {
      throw new Error('Rejection reason is required');
    }

    // קבלת פרטי הבקשה
    const getRequestSql = `
      SELECT 
        Ar.id, Ar.user_id, Ar.animal_id, Ar.status_id,
        A.name AS animal_name, A.shelter_id,
        U.full_name AS user_name
      FROM adoption_requests Ar
      INNER JOIN animals A ON Ar.animal_id = A.id
      INNER JOIN users U ON Ar.user_id = U.id
      WHERE Ar.id = ?
    `;

    const requests = await db.execute<any[]>(getRequestSql, [requestId]);

    if (requests.length === 0) {
      throw new Error('Adoption request not found');
    }

    const request = requests[0];

    // וידוא שהמנהל שייך למקלט הנכון
    if (request.shelter_id !== req.user.shelterId) {
      throw new Error('No permissions to reject this request');
    }

    // וידוא שהבקשה במצב ממתין
    if (request.status_id !== 1) {
      throw new Error('Request is not pending');
    }

    // עדכון הבקשה לנדחתה
    const updateSql = `
      UPDATE adoption_requests 
      SET status_id = 3, 
          admin_notes = ?,
          reviewed_by_user_id = ?,
          updated_at = NOW()
      WHERE id = ?
    `;

    await db.execute(updateSql, [admin_notes, req.user.userId, requestId]);

    // יצירת התראה למשתמש
    const notificationSql = `
      INSERT INTO notifications (
        user_id, notification_type, title, message,
        related_entity_type, related_entity_id,
        priority, action_url, sent_by_user_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    await db.execute(notificationSql, [
      request.user_id,
      'adoption_request_rejected',
      'Adoption Request Update',
      `Your adoption request for ${request.animal_name} requires attention. Reason: ${admin_notes}`,
      'adoption_request',
      requestId,
      'normal',
      `/my-requests/${requestId}`,
      req.user.userId,
    ]);

    return { message: 'Adoption request rejected successfully' };
  } catch (err: any) {
    console.error('Error rejecting adoption request:', err);
    throw err;
  }
};
