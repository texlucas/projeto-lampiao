// backend/middlewares/auth.middleware.ts

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { 
        id: number; 
        perfil: number; 
      };
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // 1. Verificar a presença do Token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido ou formato inválido.' });
    }

    const token = authHeader.split(' ')[1];
    
    // 2. Obter a Chave Secreta
    const secret = process.env.JWT_SECRET || 'secreto_padrao_muito_forte';

    try {
        // 3. Verificar a Validade do Token
        const decoded = jwt.verify(token, secret);
        
        // 4. Injetar dados do usuário na requisição (para uso nas rotas)
        // O token foi gerado com { id: user.id_usuario, perfil: user.id_perfil }
        req.user = decoded as { id: number; perfil: number }; 

        // 5. Continuar para o próximo middleware ou rota
        next(); 

    } catch (error) {
        // Token inválido (expirado, modificado, etc.)
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};