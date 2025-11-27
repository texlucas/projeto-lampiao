// backend/controllers/DenunciaController.ts

import type { Request, Response } from 'express';
import { denunciaService } from '../services/DenunciaService.ts'; 
import  logService  from '../services/LogService.ts'; 
import fs from 'fs'; 

class DenunciaController {
    
    // RF005/RF006/RF007: Criação de Denúncia com Anexo
    async create(req: Request, res: Response) {
        
        const requestWithUser = req as any; 
        
        // Extrai os campos do form-data (todos virão como string)
        const { 
            titulo, 
            descricao, 
            data_ocorrencia, 
            local_ocorrencia 
        } = requestWithUser.body;

        // O campo 'anonima' vem como string ('true' ou 'false')
        const anonima = requestWithUser.body.anonima === 'true'; 
        
        // O campo 'id_categoria' vem como string
        const id_categoria_string = requestWithUser.body.id_categoria || '1'; 
        const id_categoria = parseInt(id_categoria_string, 10);
        
        // RF007: Dados do arquivo (se houver, o multer salva em req.file)
        const anexoPath = requestWithUser.file ? requestWithUser.file.path : null; 

        // Dados do Token
        const id_usuario_logado = requestWithUser.user?.id; 

        // Lógica de Anonimato: se anonima for true, o id_usuario deve ser null
        const id_usuario = anonima ? null : (id_usuario_logado || null);
        
        // 1. Validação mínima (Título e Descrição)
        if (!titulo || !descricao || isNaN(id_categoria)) {
            if (anexoPath) fs.unlinkSync(anexoPath); 
            return res.status(400).json({ message: 'Título, descrição e ID da Categoria válidos são obrigatórios.' });
        }
        
        // 2. Validação de autenticação se a denúncia NÃO for anônima
        if (!anonima && !id_usuario_logado) {
            if (anexoPath) fs.unlinkSync(anexoPath); 
            return res.status(401).json({ message: 'Autenticação necessária para denúncias não anônimas.' });
        }

        try {
            const denuncia = await denunciaService.create(
                titulo, 
                descricao, 
                id_usuario, // Passa null se anônima
                id_categoria, 
                data_ocorrencia || null, 
                local_ocorrencia || null, 
                anonima, 
                anexoPath 
            );

            return res.status(201).json({ 
                message: 'Denúncia registrada com sucesso!',
                denuncia
            });

        } catch (error: unknown) {
            // Se o Service falhar, é crucial excluir o arquivo que o multer salvou (se existir)
            if (anexoPath) {
                try {
                    fs.unlinkSync(anexoPath); 
                } catch (unlinkError) {
                    console.error('Falha ao excluir o anexo após erro no DB:', unlinkError);
                }
            }
            
            let errorMessage = 'Falha ao registrar a denúncia.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return res.status(500).json({ message: errorMessage });
        }
    }

    // RF016: Listar Todas as Denúncias (Restrito à Autoridade)
    async listAllDenuncias(req: Request, res: Response) {
        const requestWithUser = req as any; 
        const id_perfil_logado = requestWithUser.user?.perfil; 

        if (!id_perfil_logado) {
             return res.status(401).json({ message: 'Autenticação necessária.' });
        }

        // Autorização: Apenas Perfis > 1 (Autoridade)
        if (id_perfil_logado <= 1) { 
            return res.status(403).json({ message: 'Acesso negado. Apenas autoridades podem listar todas as denúncias.' });
        }
        
        try {
            const denuncias = await denunciaService.listAll();
            return res.status(200).json(denuncias);

        } catch (error: unknown) {
            let errorMessage = 'Falha ao listar todas as denúncias.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return res.status(500).json({ message: errorMessage });
        }
    }

    // RF011: Lista apenas as denúncias do usuário logado
    async listMyDenuncias(req: Request, res: Response) {
        const requestWithUser = req as any; 
        const id_usuario_logado = requestWithUser.user?.id; 

        if (!id_usuario_logado) {
             return res.status(401).json({ message: 'Autenticação necessária.' });
        }

        try {
            const denuncias = await denunciaService.listByUser(id_usuario_logado); 
            return res.status(200).json(denuncias);

        } catch (error: unknown) {
            let errorMessage = 'Falha ao listar as suas denúncias.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return res.status(500).json({ message: errorMessage });
        }
    }
    
    // RF019: Detalhe de UMA denúncia específica
    async detail(req: Request, res: Response) {
        const requestWithUser = req as any; 
        const id_denuncia = parseInt(requestWithUser.params.id, 10); 
        const id_usuario_logado = requestWithUser.user?.id; 
        const id_perfil_logado = requestWithUser.user?.perfil; 

        if (!id_usuario_logado || !id_perfil_logado) {
             return res.status(401).json({ message: 'Autenticação necessária. Token inválido ou expirado.' });
        }

        if (isNaN(id_denuncia)) {
            return res.status(400).json({ message: 'ID da denúncia inválido.' });
        }

        try {
            const denuncia = await denunciaService.getById(id_denuncia);

            if (!denuncia) {
                return res.status(404).json({ message: 'Denúncia não encontrada.' });
            }

            const isAutoridade = (id_perfil_logado > 1);
            const isCriador = (id_usuario_logado === denuncia.id_usuario);
            
            if (!isAutoridade && !isCriador) {
                return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para visualizar esta denúncia.' });
            }
            
            // Lógica de Anonimato
            if (denuncia.anonima && !isCriador) {
                denuncia.nome_usuario_denunciante = 'Anônimo';
                denuncia.id_usuario = null; // Oculta o ID do criador para autoridades
            }

            return res.status(200).json(denuncia);

        } catch (error: unknown) {
            let errorMessage = 'Falha ao buscar os detalhes da denúncia.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return res.status(500).json({ message: errorMessage });
        }
    }

    // RF018/RF024: Método para alterar o status da denúncia
    async updateStatus(req: Request, res: Response) {
        const requestWithUser = req as any; 
        const id_denuncia = parseInt(requestWithUser.params.id, 10); 
        const { status: novo_status } = requestWithUser.body; 
        const id_perfil_logado = requestWithUser.user?.perfil; 
        const id_usuario_logado = requestWithUser.user?.id; 

        if (!id_usuario_logado || !id_perfil_logado) {
             return res.status(401).json({ message: 'Autenticação necessária. Token inválido ou expirado.' });
        }

        if (isNaN(id_denuncia) || !novo_status) {
            return res.status(400).json({ message: 'ID da denúncia e novo status são obrigatórios.' });
        }
        
        // Autorização: Apenas perfis de Autoridade (Perfil > 1)
        if (id_perfil_logado <= 1) {
            return res.status(403).json({ message: 'Acesso negado. Apenas autoridades podem alterar o status da denúncia.' });
        }

        try {
            const denunciaAtualizada = await denunciaService.updateStatus(id_denuncia, novo_status);
            
            // LOG DE AUDITORIA (RF024)
            const logDetails = `Status da Denúncia ${id_denuncia} alterado para ${novo_status}.`;
            
             await logService.logUserAction(id_usuario_logado, 'DENUNCIA_STATUS_UPDATE', true, logDetails);
            
            return res.status(200).json({
                message: 'Status da denúncia atualizado com sucesso!',
                denuncia: denunciaAtualizada
            });

        } catch (error: unknown) {
            let errorMessage = 'Falha ao atualizar o status da denúncia.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return res.status(500).json({ message: errorMessage });
        }
    }
}

export const denunciaController = new DenunciaController();