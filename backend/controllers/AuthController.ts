// backend/controllers/AuthController.ts 
import type { Request, Response } from 'express';
import { userService } from '../services/UserService.ts'; 

class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { email, senha } = req.body;
            
            // Validação básica
            if (!email || !senha) {
                return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
            }

            // Chama o Service para autenticar e gerar o token
            // authData será { token, user }
            const authData = await userService.login(email, senha);
            
            // RF003: Sucesso! Retorna 200 OK com o token e dados do usuário
            // Usamos os campos que o UserService já retorna: token e user
            return res.status(200).json({
                message: 'Login realizado com sucesso!',
                token: authData.token, // Retorna o Token JWT
                user: authData.user    // Retorna os dados do usuário
            });

        } catch (error: unknown) {
            
            if (error instanceof Error) {
                
                // RF002: Se o erro for a credencial inválida (lançado pelo Service), retorna 401
                if (error.message.includes('Usuário ou senha inválidos')) {
                    return res.status(401).json({ message: 'Credenciais inválidas.' });
                }
                
                // Para qualquer outro erro de Service/DB (erro inesperado), retorna 500
                return res.status(500).json({ message: error.message });
            }
            
            // Fallback para erro completamente desconhecido
            return res.status(500).json({ message: 'Falha desconhecida no processo de login.' });
        }
    }
}
export const authController = new AuthController();