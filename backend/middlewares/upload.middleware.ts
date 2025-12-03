// backend/middlewares/upload.middleware.ts

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuração do destino e nome do arquivo
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define o diretório de destino
        const uploadDir = path.join(process.cwd(), 'uploads');

        // Cria o diretório se ele não existir
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Cria um nome de arquivo único (ex: 1764358785-imagem-denuncia.jpg)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const fileName = `${uniqueSuffix}${fileExtension}`;
        cb(null, fileName);
    }
});

// Filtro de arquivos: aceita apenas imagens e PDFs
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        // Rejeita o arquivo
        cb(null, false);
    }
};

// Configuração principal do Multer
// Limite de 5MB por arquivo
export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter 
});