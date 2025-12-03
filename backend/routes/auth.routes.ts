// backend/routes/auth.routes.ts (CORREÇÃO)

import pkg from 'express';
const { Router } = pkg;
import { authController } from '../controllers/AuthController'; 

const authRouter = Router();

// Apenas Rota POST para o Login (RF003)
authRouter.post('/login', authController.login); 


export default authRouter;