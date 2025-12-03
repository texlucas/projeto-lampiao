// backend/controllers/UserController.ts
import type { Request, Response } from 'express';
import { userService } from '../services/UserService'; 
import  logService  from '../services/LogService'; 

class UserController {
    async register(req: Request, res: Response) {
        try {
            const { nome, email, senha } = req.body;
            
            // 1. Validação básica de campos obrigatórios
            if (!nome || !email || !senha) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios (nome, email, senha).' });
            }

            // 2. Chama a lógica de negócio (validação de e-mail e inserção no BD)
            const newUser = await userService.register(nome, email, senha);
            
            // 3. Resposta de Sucesso (201 Created)
            return res.status(201).json({ 
                message: 'Cadastro realizado com sucesso!',
                user: newUser 
            });

        } catch (error) {
            
            // Tratamento do erro 'error is of type unknown'
            let errorMessage = 'Ocorreu um erro desconhecido no cadastro.';
            
            // 4. Verifica se o erro é uma instância padrão de Error
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            // 5. Resposta de Erro (400 Bad Request)
            return res.status(400).json({ message: errorMessage });
        }
    }

    async getMe(req: Request, res: Response) {
        const requestWithUser = req as any; 
        const id_usuario_logado = requestWithUser.user?.id; 

        if (!id_usuario_logado) {
             return res.status(401).json({ message: 'Autenticação necessária.' });
        }

        try {
            const user = await userService.getById(id_usuario_logado);

            if (!user) {
                // Se o usuário existir no token, mas não no DB (erro crítico)
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            // Apenas retorna os dados públicos
            return res.status(200).json(user);

        } catch (error: unknown) {
            let errorMessage = 'Falha ao buscar dados do usuário.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return res.status(500).json({ message: errorMessage });
        }
    }
    async listAll(req: Request, res: Response) {
        // Truque para ignorar o erro de tipagem TS e acessar os dados do token
        const requestWithUser = req as any; 
        const id_perfil_logado = requestWithUser.user?.perfil; 

        if (!id_perfil_logado) {
             return res.status(401).json({ message: 'Autenticação necessária.' });
        }
        
        // Autorização: Apenas Perfis > 1 (Autoridade)
        if (id_perfil_logado <= 1) { 
            return res.status(403).json({ message: 'Acesso negado. Apenas autoridades podem listar usuários.' });
        }

        try {
            // Chamamos o método do Service (que você precisa ter no UserService.ts)
            const users = await userService.listAll();
            return res.status(200).json(users);
            
        } catch (error: unknown) {
            let errorMessage = 'Falha ao listar usuários.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return res.status(500).json({ message: errorMessage });
        }
    }

    async updateMe(req: Request, res: Response) {
        const requestWithUser = req as any; 
        const id_usuario_logado = requestWithUser.user?.id; 

        if (!id_usuario_logado) {
             return res.status(401).json({ message: 'Autenticação necessária.' });
        }
        
        // Apenas nome e email podem ser alterados pelo próprio usuário
        const { nome, email } = req.body;
        
        // Validação mínima para garantir que algo foi enviado
        if (!nome && !email) {
            return res.status(400).json({ message: 'Forneça o nome ou o email para atualizar.' });
        }

        try {
            const updatedUser = await userService.updateProfile(id_usuario_logado, nome, email);
            
            return res.status(200).json({
                message: 'Perfil atualizado com sucesso.',
                user: updatedUser
            });

        } catch (error: unknown) {
            let errorMessage = 'Falha ao atualizar perfil.';
            if (error instanceof Error) {
                errorMessage = error.message;
                if (errorMessage.includes('e-mail já está cadastrado')) {
                    return res.status(409).json({ message: errorMessage }); // 409 Conflict
                }
            }
            return res.status(500).json({ message: errorMessage });
        }
    }

    async changePassword(req: Request, res: Response) {
        const requestWithUser = req as any; 
        const id_usuario_logado = requestWithUser.user?.id; 

        if (!id_usuario_logado) {
             return res.status(401).json({ message: 'Autenticação necessária.' });
        }
        
        const { oldSenha, newSenha } = req.body;
        
        if (!oldSenha || !newSenha) {
            return res.status(400).json({ message: 'A senha antiga e a nova senha são obrigatórias.' });
        }

        try {
            const result = await userService.changePassword(id_usuario_logado, oldSenha, newSenha);
            
            return res.status(200).json(result);

        } catch (error: unknown) {
            let errorMessage = 'Falha ao alterar senha.';
            if (error instanceof Error) {
                errorMessage = error.message;
                // Retorna 400 ou 403 para erros de validação/permissão
                if (errorMessage.includes('incorreta') || errorMessage.includes('caracteres')) {
                    return res.status(403).json({ message: errorMessage }); 
                }
            }
            return res.status(500).json({ message: errorMessage });
        }
    }

    async adminResetPassword(req: Request, res: Response) {
        const requestWithUser = req as any; 
        const id_perfil_logado = requestWithUser.user?.perfil; 
        const { id } = req.params; // ID do usuário que terá a senha alterada
        const { newSenha } = req.body;
        const targetId = parseInt(id); // ID do usuário alvo

        // 1. Autorização: Apenas Perfis > 1 (Autoridade)
        if (!id_perfil_logado || id_perfil_logado <= 1) { 
            return res.status(403).json({ message: 'Acesso negado. Apenas autoridades podem redefinir senhas.' });
        }
        
        if (!newSenha) {
            return res.status(400).json({ message: 'A nova senha é obrigatória.' });
        }

        try {
            const result = await userService.adminResetPassword(targetId, newSenha);
            
            // RF024: Log de Ação Administrativa (Redefinição de Senha)
            await logService.logUserAction(
                requestWithUser.user.id, // ID do ADMIN que realizou a ação
                'SENHA_RESET_ADMIN', 
                true, 
                `Admin ${requestWithUser.user.id} redefiniu a senha do Usuário: ${targetId}.`
            );
            
            return res.status(200).json(result);

        } catch (error: unknown) {
            let errorMessage = 'Falha ao redefinir senha.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            // 400 para erros de validação e 404 para usuário não encontrado
            const statusCode = errorMessage.includes('caracteres') || errorMessage.includes('obrigatória') ? 400 : 500;
            return res.status(statusCode).json({ message: errorMessage });
        }
    }


    
}

export const userController = new UserController();