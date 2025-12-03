import type { Request, Response } from "express";
import { denunciaService } from "../services/DenunciaService";
import logService from "../services/LogService";
import fs from "fs";

class DenunciaController {

  // Criar denúncia
  async create(req: Request, res: Response) {
    const requestWithUser = req as any;

    const { descricao, categoria, anonima } = requestWithUser.body;

    // anonima vem como string → converter
    const isAnonima = anonima === "true";

    // categoria vem como string → converter
    const id_categoria = parseInt(categoria);

    // múltiplos arquivos
    const anexos = requestWithUser.files as Express.Multer.File[] | undefined;

    const id_usuario_logado = requestWithUser.user?.id;

    const id_usuario = isAnonima ? null : id_usuario_logado;

    // validações
    if (!descricao || !id_categoria) {
      // excluir arquivos enviados se houver erro
      anexos?.forEach((f) => fs.unlinkSync(f.path));
      return res.status(400).json({
        message: "Descrição e Categoria são obrigatórias.",
      });
    }

    if (!isAnonima && !id_usuario_logado) {
      anexos?.forEach((f) => fs.unlinkSync(f.path));
      return res.status(401).json({
        message: "Você precisa estar logado para enviar denúncia identificada.",
      });
    }

    try {
      const denuncia = await denunciaService.create({
        descricao,
        anonima: isAnonima,
        id_usuario,
        id_categoria,
        anexos
      });

      return res.status(201).json({
        message: "Denúncia registrada com sucesso!",
        denuncia,
      });
    } catch (error: any) {
      // limpar arquivos caso o create falhe
      anexos?.forEach((f) => fs.unlinkSync(f.path));

      return res.status(500).json({
        message: error?.message || "Erro ao registrar a denúncia.",
      });
    }
  }

  // Lista TODAS (somente autoridade)
  async listAllDenuncias(req: Request, res: Response) {
    const requestWithUser = req as any;
    const perfil = requestWithUser.user?.perfil;

    if (!perfil) {
      return res.status(401).json({ message: "Autenticação necessária." });
    }

    if (perfil <= 1) {
      return res.status(403).json({ message: "Acesso negado." });
    }

    try {
      const denuncias = await denunciaService.listAll();
      return res.status(200).json(denuncias);
    } catch (e: any) {
      return res.status(500).json({ message: e.message });
    }
  }

  // Lista MINHAS denúncias
  async listMyDenuncias(req: Request, res: Response) {
    const requestWithUser = req as any;
    const id = requestWithUser.user?.id;

    if (!id) {
      return res.status(401).json({ message: "Autenticação necessária." });
    }

    try {
      const denuncias = await denunciaService.listByUser(id);
      return res.status(200).json(denuncias);
    } catch (e: any) {
      return res.status(500).json({ message: e.message });
    }
  }

  // Detalhar denúncia
  async detail(req: Request, res: Response) {
    const requestWithUser = req as any;
    const id_denuncia = parseInt(req.params.id, 10);

    const id_usuario = requestWithUser.user?.id;
    const perfil = requestWithUser.user?.perfil;

    if (!id_usuario || !perfil) {
      return res.status(401).json({ message: "Autenticação necessária." });
    }

    try {
      const denuncia = await denunciaService.getById(id_denuncia);

      if (!denuncia) {
        return res.status(404).json({ message: "Denúncia não encontrada." });
      }

      const isAutoridade = perfil > 1;
      const isDono = denuncia.id_usuario === id_usuario;

      if (!isAutoridade && !isDono) {
        return res.status(403).json({ message: "Acesso negado." });
      }

      // anonimato
      if (denuncia.anonima && !isDono) {
        denuncia.nome_usuario_denunciante = "Anônimo";
        denuncia.id_usuario = null;
      }

      return res.status(200).json(denuncia);
    } catch (e: any) {
      return res.status(500).json({ message: e.message });
    }
  }

  // Atualizar status
  async updateStatus(req: Request, res: Response) {
    const requestWithUser = req as any;
    const id_denuncia = parseInt(req.params.id, 10);
    const { status } = requestWithUser.body;

    const perfil = requestWithUser.user?.perfil;
    const id_usuario = requestWithUser.user?.id;

    if (!perfil || !id_usuario) {
      return res.status(401).json({ message: "Autenticação necessária." });
    }

    if (perfil <= 1) {
      return res.status(403).json({ message: "Apenas autoridades podem alterar o status." });
    }

    if (!status) {
      return res.status(400).json({ message: "Novo status é obrigatório." });
    }

    try {
      const denunciaAtualizada = await denunciaService.updateStatus(id_denuncia, status);

      await logService.logUserAction(
        id_usuario,
        "DENUNCIA_STATUS_UPDATE",
        true,
        `Status da denúncia ${id_denuncia} alterado para ${status}`
      );

      return res.status(200).json({
        message: "Status atualizado com sucesso!",
        denuncia: denunciaAtualizada,
      });
    } catch (e: any) {
      return res.status(500).json({ message: e.message });
    }
  }
}

export const denunciaController = new DenunciaController();
