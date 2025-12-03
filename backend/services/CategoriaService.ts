// backend/services/CategoriaService.ts

import pool from '../db/postgres'; 
import type { QueryResult } from 'pg';

class CategoriaService {
    
    // Método para buscar todas as categorias (RF008)
async getAllCategorias() {
        const queryText = `
            SELECT 
                id_categoria, 
                nome_categoria,   -- <--- CORRIGIDO NO SELECT
                descricao
            FROM public.categoriadenuncia   
            ORDER BY nome_categoria ASC;    -- <--- CORRIGIDO NO ORDER BY
        `;
        
        try {
            const result: QueryResult = await pool.query(queryText);
            
            return result.rows; 

        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            throw new Error('Não foi possível buscar a lista de categorias.');
        }
    }
}

export default new CategoriaService();