// backend/controllers/CategoriaController.ts

import type { Request, Response } from 'express';
import CategoriaService from '../services/CategoriaService';
class CategoriaController {

    async listAll(req: Request, res: Response) {
        try {
            // Chama o Service para buscar a lista
            const categorias = await CategoriaService.getAllCategorias();
            
            // Retorna o Status 200 OK com a lista no corpo
            return res.status(200).json(categorias);

        } catch (error: unknown) {
            let errorMessage = 'Falha ao listar categorias.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            // Retorna Status 500 em caso de erro no BD
            return res.status(500).json({ message: errorMessage });
        }
    }
}

export default new CategoriaController();