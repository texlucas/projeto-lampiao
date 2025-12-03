// backend/services/DenunciaService.ts

import pool from '../db/postgres';
import type { QueryResult } from 'pg'; 

// Função de utilidade simples para gerar um protocolo
const generateProtocol = () => {
    return `DEN${Date.now()}`; 
};

class DenunciaService {

    async create(
        titulo: string, 
        descricao: string, 
        id_usuario: number | null, // Permite null para denúncia anônima
        id_categoria: number,
        data_ocorrencia: string | null, 
        local_ocorrencia: string | null, 
        anonima: boolean,
        caminho_anexo: string | null 
    ) {
        
        const STATUS_PENDENTE = 'Recebida'; // Usando status como string, se for o seu schema
        const protocolo = generateProtocol(); // Gera o protocolo (RF010)
        
        const queryText = `
            INSERT INTO "denuncia" (
                tipo_denuncia, 
                descricao, 
                id_usuario, 
                status, 
                id_categoria, 
                data_ocorrencia, 
                local_ocorrencia, 
                anonima, 
                protocolo, 
                caminho_anexo  // <-- NOVO: Coluna para o anexo
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING id_denuncia, tipo_denuncia, data_registro, protocolo;
        `; 
        
        const values = [
            titulo, 
            descricao, 
            id_usuario, 
            STATUS_PENDENTE, 
            id_categoria, 
            data_ocorrencia, 
            local_ocorrencia, 
            anonima,
            protocolo, 
            caminho_anexo 
        ];

        try {
            const result: QueryResult = await pool.query(queryText, values);
            
            return result.rows[0];

        } catch (error) {
            console.error('Erro ao criar denúncia:', error);
            throw new Error('Não foi possível registrar a denúncia.');
        }
    }

    // RF007: Listar Denúncias do Usuário Logado
    async listByUser(id_usuario: number) {
        const queryText = `
            SELECT 
                d.id_denuncia, 
                d.tipo_denuncia AS titulo, 
                d.data_registro,
                d.status,
                d.protocolo, // Incluindo protocolo
                c.nome_categoria
            FROM "denuncia" d
            JOIN public.categoriadenuncia c ON d.id_categoria = c.id_categoria
            WHERE d.id_usuario = $1
            ORDER BY d.data_registro DESC;
        `;
        
        try {
            const result: QueryResult = await pool.query(queryText, [id_usuario]);
            return result.rows; 

        } catch (error) {
            console.error('Erro ao listar denúncias do usuário:', error);
            throw new Error('Não foi possível buscar as denúncias do usuário logado.');
        }
    }

    // RF016: Listar Todas as Denúncias (Restrito à Autoridade)
    async listAll() {
        const queryText = `
            SELECT 
                d.id_denuncia, 
                d.tipo_denuncia AS titulo, 
                d.data_registro,
                d.status,
                d.protocolo, // Incluindo protocolo
                c.nome_categoria
            FROM "denuncia" d
            JOIN public.categoriadenuncia c ON d.id_categoria = c.id_categoria
            ORDER BY d.data_registro DESC;
        `;
        
        try {
            const result: QueryResult = await pool.query(queryText);
            return result.rows; 

        } catch (error) {
            console.error('Erro ao listar todas as denúncias:', error);
            throw new Error('Não foi possível buscar a lista completa de denúncias.');
        }
    }

    // RF019: Detalhe de UMA denúncia específica
    async getById(id_denuncia: number) {
        const queryText = `
            SELECT 
                d.id_denuncia, 
                d.tipo_denuncia, 
                d.descricao,
                d.data_registro,
                d.status,
                d.id_usuario,
                d.data_ocorrencia,
                d.local_ocorrencia,
                d.anonima,
                d.protocolo, 
                d.caminho_anexo, // <-- NOVO: Traz o caminho do anexo para o detalhe
                u.nome AS nome_usuario_denunciante,
                c.nome_categoria 
            FROM "denuncia" d
            LEFT JOIN "usuario" u ON d.id_usuario = u.id_usuario
            JOIN public.categoriadenuncia c ON d.id_categoria = c.id_categoria
            WHERE d.id_denuncia = $1;
        `;
        
        try {
            const result: QueryResult = await pool.query(queryText, [id_denuncia]);
            
            if (result.rows.length === 0) {
                return null; // Denúncia não encontrada
            }

            return result.rows[0]; 

        } catch (error) {
            console.error('Erro ao buscar denúncia por ID:', error);
            throw new Error('Não foi possível buscar os detalhes da denúncia.');
        }
    }

    // RF018: Alterar Status
    async updateStatus(id_denuncia: number, novo_status: string) {
        const queryText = `
            UPDATE "denuncia" 
            SET status = $1 
            WHERE id_denuncia = $2
            RETURNING id_denuncia, status, data_registro;
        `;
        
        try {
            const result: QueryResult = await pool.query(queryText, [novo_status, id_denuncia]);
            
            if (result.rows.length === 0) {
                throw new Error('Denúncia não encontrada.');
            }

            return result.rows[0]; 

        } catch (error) {
            console.error('Erro ao atualizar status da denúncia:', error);
            throw new Error('Não foi possível atualizar o status da denúncia.');
        }
    }
}

export const denunciaService = new DenunciaService();