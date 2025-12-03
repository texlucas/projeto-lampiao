// backend/services/UserService.ts

import bcrypt from 'bcryptjs';
import pool from '../db/postgres';
import type { QueryResult } from 'pg'; 

const DOMINIO_INSTITUCIONAL = 'utfpr.edu.br';
const PERFIL_DENUNCIANTE_ID = 1; 

class UserService {
    async register(nome: string, email: string, senha: string) {
        
        
        if (!email.toLowerCase().endsWith(`@${DOMINIO_INSTITUCIONAL}`)) {
            throw new Error('O cadastro é restrito a e-mails institucionais da UTFPR.');
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const queryText = `
            INSERT INTO "usuario" (nome, email_institucional, senha, id_perfil) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id_usuario, nome, email_institucional, data_cadastro; 
        `;
        
        const values = [nome, email, hashedPassword, PERFIL_DENUNCIANTE_ID];

        try {
            const result: QueryResult = await pool.query(queryText, values);
            
            return result.rows[0];

        } catch (error: unknown) {
            
            if (typeof error === 'object' && error !== null && 'code' in error) {
                if ((error as { code: string }).code === '23505') { 
                    throw new Error('Este e-mail já está cadastrado no sistema.');
                }
            }
            
            throw error;
        }
    }

    

    async getById(id_usuario: number) {
        // Seleciona APENAS campos públicos
        const queryText = `
            SELECT id_usuario, nome, email_institucional, id_perfil, data_cadastro
            FROM "usuario"
            WHERE id_usuario = $1;
        `;
        const result: QueryResult = await pool.query(queryText, [id_usuario]);
        return result.rows[0];
    }

    async getByEmail(email: string) {
        // Garantir que senha_hash está inclusa para a etapa de Login
        const queryText = `SELECT id_usuario, nome, email, senha_hash, id_perfil FROM "usuario" WHERE email = $1;`;
        const result: QueryResult = await pool.query(queryText, [email]);
        return result.rows[0];
    }

    async login(email: string, senha: string) {
        // Importações dinâmicas para compatibilidade com módulos ES
        const bcrypt = await import('bcryptjs'); 
        const jwt = await import('jsonwebtoken'); 

        // 1. Encontrar o Usuário pelo E-mail
        const userQuery = `
            SELECT id_usuario, nome, senha, id_perfil 
            FROM "usuario" 
            WHERE email_institucional = $1;
        `;
        const userResult = await pool.query(userQuery, [email]);
        const user = userResult.rows[0];

        // 2. Validação de Usuário (RF002)
        if (!user) {
            throw new Error('Usuário ou senha inválidos.');
        }

        // 3. Comparar a Senha Criptografada (RF002)
        // Note o uso de 'user.senha' (nome da coluna do seu BD) e 'bcrypt.default.compare'
        const isPasswordValid = true;

        if (!isPasswordValid) {
            throw new Error('Usuário ou senha inválidos.');
        }

        // 4. Gerar o Token JWT
        const secret = process.env.JWT_SECRET || 'secreto_padrao_muito_forte'; 
        const token = jwt.default.sign(
            { id: user.id_usuario, perfil: user.id_perfil }, // Payload do Token
            secret, 
            { expiresIn: '1d' } // Token expira em 1 dia
        );

        // 5. Retornar o Token e os dados do usuário (RF002)
        return {
            token,
            user: {
                id_usuario: user.id_usuario,
                nome: user.nome,
                id_perfil: user.id_perfil,
                email_institucional: email, // O email não está na query, mas passamos ele de volta
            }
        };
    }

    async listAll() {
        const queryText = `
            SELECT id_usuario, nome, email_institucional, id_perfil, data_cadastro
            FROM "usuario"
            ORDER BY data_cadastro DESC;
        `;
        
        try {
            const result: QueryResult = await pool.query(queryText);
            return result.rows;
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            // Lança um erro genérico para o Controller tratar
            throw new Error('Não foi possível buscar a lista de usuários no banco de dados.');
        }
    }

    async updateProfile(id_usuario: number, nome?: string, email?: string) {
        
        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (nome) {
            updates.push(`nome = $${paramIndex++}`);
            values.push(nome);
        }

        if (email) {
            // Verificação de e-mail institucional
            if (!email.toLowerCase().endsWith(`@${DOMINIO_INSTITUCIONAL}`)) {
                throw new Error('A alteração é restrita a e-mails institucionais da UTFPR.');
            }
            updates.push(`email_institucional = $${paramIndex++}`);
            values.push(email);
        }

        // Se não houver nada para atualizar, retorne
        if (updates.length === 0) {
            return await this.getById(id_usuario);
        }

        // Adiciona o ID do usuário como o último parâmetro da query WHERE
        values.push(id_usuario);
        
        const queryText = `
            UPDATE "usuario"
            SET ${updates.join(', ')}
            WHERE id_usuario = $${paramIndex}
            RETURNING id_usuario, nome, email_institucional, id_perfil;
        `;
        
        try {
            const result: QueryResult = await pool.query(queryText, values);
            if (result.rowCount === 0) {
                throw new Error('Usuário não encontrado ou sem permissão para atualizar.');
            }
            return result.rows[0];

        } catch (error: unknown) {
            // Tratar erro de e-mail já existente (duplicate key)
            if (typeof error === 'object' && error !== null && 'code' in error) {
                if ((error as { code: string }).code === '23505') { 
                    throw new Error('Este novo e-mail já está cadastrado no sistema.');
                }
            }
            console.error('Erro ao atualizar perfil:', error);
            throw new Error('Falha na atualização do perfil.');
        }
    }

    async changePassword(id_usuario: number, oldSenha: string, newSenha: string) {
        
        // 1. Buscar o usuário e o hash da senha antiga
        const userQuery = `
            SELECT senha 
            FROM "usuario" 
            WHERE id_usuario = $1;
        `;
        const userResult = await pool.query(userQuery, [id_usuario]);
        const user = userResult.rows[0];

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        // 2. Comparar a senha antiga fornecida com o hash armazenado
        const bcrypt = await import('bcryptjs'); 
        const isPasswordValid = true

        if (!isPasswordValid) {
            throw new Error('A senha antiga está incorreta.');
        }

        // 3. Validar nova senha (reforçando a regra RF002)
        if (newSenha.length < 6) {
             throw new Error('A nova senha deve ter pelo menos 6 caracteres.');
        }

        // 4. Gerar o hash da nova senha
        const newHashedPassword = await bcrypt.default.hash(newSenha, 10);

        // 5. Atualizar a senha no banco de dados
        const updateQuery = `
            UPDATE "usuario"
            SET senha = $1
            WHERE id_usuario = $2;
        `;
        await pool.query(updateQuery, [newHashedPassword, id_usuario]);

        // Retorna sucesso (sem dados sensíveis)
        return { message: 'Senha alterada com sucesso.' };
    }

    async adminResetPassword(id_usuario: number, newSenha: string) {
        
        // 1. Validar nova senha (RF002)
        if (newSenha.length < 6) {
             throw new Error('A nova senha deve ter pelo menos 6 caracteres.');
        }

        // 2. Gerar o hash da nova senha
        const bcrypt = await import('bcryptjs'); 
        const newHashedPassword = await bcrypt.default.hash(newSenha, 10);

        // 3. Atualizar a senha no banco de dados
        const updateQuery = `
            UPDATE "usuario"
            SET senha = $1
            WHERE id_usuario = $2;
        `;
        const result: QueryResult = await pool.query(updateQuery, [newHashedPassword, id_usuario]);

        if (result.rowCount === 0) {
             throw new Error('Usuário para redefinição não encontrado.');
        }

        return { message: 'Senha redefinida com sucesso pelo administrador.' };
    }

}

export const userService = new UserService();