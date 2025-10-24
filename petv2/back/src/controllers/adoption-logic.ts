import { Request, Response, NextFunction } from 'express';
import db from '../models';
import { create } from 'domain';


export const createAdoptionRequest = async (
  req: Request, res: Response, next: NextFunction
) => {
    try {
        const { userId, animalId, message } = req.body;
        if (!userId || !animalId || !message) { 
            return res.status(400).json({ error: 'Missing required fields:', userId, animalId, message });
        }
        
        const newRequest = await db.AdoptionRequest.create({
            userId,
            animalId,
            message,
            status: 'pending',
            createdAt: new Date(),
        });
        console.log('✅ Adoption request created:', newRequest);
        return res.status(201).json({ message: 'Adoption request created successfully', request: newRequest });
    } catch (error: any) {
        console.error('❌ Error creating adoption request:', error);
        throw new Error('Failed to create adoption request');
    }
}