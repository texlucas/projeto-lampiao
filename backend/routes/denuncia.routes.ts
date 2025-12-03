// backend/routes/denuncia.routes.ts 

import { Router } from 'express';
import { denunciaController } from '../controllers/DenunciaController';
import { authMiddleware } from '../middlewares/auth.middleware'; 
import { upload } from '../middlewares/upload.middleware'; 

const denunciaRouter = Router();

// 1. ROTAS FIXAS / ESPECÍFICAS (Mantenha esta ordem!)

// Rota para alterar status (RF018/RF024) - Ordem 1: A mais específica
denunciaRouter.patch('/:id/status', authMiddleware, denunciaController.updateStatus);

// Rota para listar SOMENTE as denúncias do usuário logado (RF007) - Ordem 2: Fixa, deve vir antes do /:id
denunciaRouter.get('/minhas', authMiddleware, denunciaController.listMyDenuncias);


// 2. ROTAS WILDÇARD (DINÂMICAS)

// Rota para buscar detalhes de UMA denúncia específica (RF019) - Ordem 3: DEVE VIR ANTES DE /
denunciaRouter.get('/:id', authMiddleware, denunciaController.detail);


// 3. ROTAS RAIZ (MENOS ESPECÍFICAS)

// Rota para listar TODAS as denúncias (RF017 - Restrita por Controller) - Ordem 4: Rota RAIZ
denunciaRouter.get('/', authMiddleware, denunciaController.listAllDenuncias);


// 4. ROTAS POST (NÃO AFETAM A ORDEM DE GET)

// Rota para criar denúncia (POST)
denunciaRouter.post('/', authMiddleware, upload.single('anexo'), denunciaController.create); 

export default denunciaRouter;