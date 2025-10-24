import { NextFunction, Request, Response, Router } from "express";
import { verifyToken } from "../middleware/auth";
import { createAdoptionRequest } from "../controllers/adoption-logic";

export const adoptionRequestsRouter = Router();

adoptionRequestsRouter.post('/',
    verifyToken,
    async (req: Request, res:Response, next:NextFunction) => {
        try {
            // Logic to create a new adoption request
            const adoptionRequest = await createAdoptionRequest(req, res, next);
            res.status(201).json({ message: 'Adoption request created successfully' });
        } catch (err) {
            next(err);
        }
    }
)