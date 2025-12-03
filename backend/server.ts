// backend/server.ts 

import express from 'express';
import cors from "cors";

// Importações de rotas
import authRouter from './routes/auth.routes.ts'; 
import denunciaRouter from './routes/denuncia.routes.ts'; 
import categoriaRouter from './routes/categoria.routes.ts'; 
import userRouter from './routes/user.routes.ts'; 

const app = express();

// --- CONFIGURAÇÃO DE MIDDLEWARES ---

// 1. Processa corpo JSON (para login, cadastro, etc.)
app.use(express.json());

// 2. Processa dados de formulário simples (necessário para os campos de texto no form-data)
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:5173", // frontend Vite
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use('/uploads', express.static('uploads'));

// --- REGISTRO DE ROTAS ---

app.use('/auth', authRouter);
app.use('/denuncias', denunciaRouter);
app.use('/categorias', categoriaRouter);
app.use('/users', userRouter); 

// --- INICIALIZAÇÃO DO SERVIDOR ---

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});