import { Router, Request, Response } from "express";
import multer from 'multer'
import path from 'path'
import { verifyToken } from "../middleware/auth";
import { error } from "console";

const uploadRouter = Router();

const storage = multer.diskStorage({
    destination: (
        req: Request, file: Express.Multer.File,
        cb: (error: Error | null, destination:string) => void) =>
    { cb(null, 'public/uploads/') },
    filename: 
        (req: Request, file: Express.Multer.File, 
        cb:(error:Error | null, filename: string) => void)=> {
            const uniqueSuffix = Date.now();
            cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})
const upload = multer({ storage });
uploadRouter.post('/', verifyToken, upload.single('image'),
    (req: Request, res: Response) => {
        if (!req.file) {
        return res.status(400).json({error: 'No File uploaded'})
        }    
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.status(200).json({ imageUrl });
    
    })
    export {uploadRouter}