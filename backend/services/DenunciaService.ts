// backend/services/DenunciaService.ts
import pool from "../db/postgres";
import type { QueryResult } from "pg";

// Gerar protocolo único
const generateProtocol = () => `DEN${Date.now()}`;

export interface NovaDenunciaInput {
    descricao: string;
    anonima: boolean;
    id_usuario: number | null;
    id_categoria: number;
    anexos: { path: string }[] | null;
}

class DenunciaService {
    // Criar nova denúncia (novo formato)
    async create(data: NovaDenunciaInput) {
        const protocolo = generateProtocol();

        const queryText = `
            INSERT INTO denuncia (
                descricao,
                anonima,
                id_usuario,
                id_categoria,
                protocolo
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_denuncia, descricao, anonima, protocolo;
        `;

        const caminho_anexo = data.anexos?.length
            ? data.anexos.map(a => a.path).join(";")
            : null;

        const values = [
            data.descricao,
            data.anonima,
            data.id_usuario,
            data.id_categoria,
            protocolo,
        ];

        try {
            const result: QueryResult = await pool.query(queryText, values);
            return result.rows[0];
        } catch (error) {
            console.error("Erro ao criar denúncia:", error);
            throw new Error("Não foi possível registrar a denúncia.");
        }
    }

    // Listar denúncias do usuário logado
    async listByUser(id_usuario: number) {
        const queryText = `
            SELECT *
            FROM denuncia
            WHERE id_usuario = $1
            ORDER BY data_registro DESC;
        `;

        const result = await pool.query(queryText, [id_usuario]);
        return result.rows;
    }

    // Listar todas
    async listAll() {
        const queryText = `
            SELECT *
            FROM denuncia
            ORDER BY data_registro DESC;
        `;

        const result = await pool.query(queryText);
        return result.rows;
    }

    // Buscar por ID
    async getById(id_denuncia: number) {
        const queryText = `
            SELECT *
            FROM denuncia
            WHERE id_denuncia = $1;
        `;

        const result = await pool.query(queryText, [id_denuncia]);
        return result.rows[0] || null;
    }

    // Atualizar status
    async updateStatus(id_denuncia: number, novo_status: string) {
        const queryText = `
            UPDATE denuncia
            SET status = $1
            WHERE id_denuncia = $2
            RETURNING *;
        `;

        const result = await pool.query(queryText, [novo_status, id_denuncia]);
        return result.rows[0];
    }
}

export const denunciaService = new DenunciaService();
