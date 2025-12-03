// backend/services/LogService.ts

import pool from '../db/postgres';
import type { QueryResult } from 'pg';

class LogService {

    // Registra a ação crítica no BD
    async recordLog(id_usuario: number, acao: string, detalhes: string) {
        
        const queryText = `
            INSERT INTO log_auditoria (id_usuario, acao, detalhes, data_registro)
            VALUES ($1, $2, $3, NOW());
        `;
        
        const values = [id_usuario, acao, detalhes];

        try {
            await pool.query(queryText, values);
        } catch (error) {
            // Logar o erro, mas não travar a aplicação, pois o log é secundário
            console.error('ERRO CRÍTICO ao gravar log de auditoria:', error);
        }
    }
    async logUserAction(id_usuario: number | null, acao: string, sucesso: boolean, detalhes?: string) {
        // id_usuario pode ser NULL para tentativas de login falhas
        const queryText = `
            INSERT INTO "log_auditoria" (id_usuario, acao, sucesso, detalhes)
            VALUES ($1, $2, $3, $4);
        `;
        const values = [id_usuario, acao, sucesso, detalhes];
        
        try {
            await pool.query(queryText, values);
        } catch (error) {
            console.error('ERRO CRÍTICO ao registrar log:', error);
            // O sistema deve continuar funcionando mesmo se o log falhar
        }
    }

    
}

export default new LogService();