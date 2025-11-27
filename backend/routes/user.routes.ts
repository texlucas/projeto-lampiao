// backend/routes/user.routes.ts 

import { Router } from 'express';
import { userController } from '../controllers/UserController.ts';
import { authMiddleware } from '../middlewares/auth.middleware.ts';

const userRouter = Router();

// 1. Rota de Cadastro (RF001/RF002) 
userRouter.post('/register', userController.register);

// 2. Rota para VISUALIZAR O PRÓPRIO PERFIL (RF004 Complemento)
userRouter.get('/me', authMiddleware, userController.getMe);
userRouter.patch('/me', authMiddleware, userController.updateMe); 
userRouter.patch('/me/password', authMiddleware, userController.changePassword); 

// 3. Rota para Listagem Geral (RF004)
userRouter.get('/', authMiddleware, userController.listAll);
userRouter.patch('/:id/password', authMiddleware, userController.adminResetPassword); 

export default userRouter;