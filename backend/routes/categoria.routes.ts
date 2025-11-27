// backend/routes/categoria.routes.ts

import { Router } from 'express';
import CategoriaController from '../controllers/CategoriaController.ts';

const categoriaRouter = Router();

// Rota GET para listar todas as categorias (RF008)
categoriaRouter.get('/', CategoriaController.listAll);

export default categoriaRouter;