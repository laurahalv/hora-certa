// gerenciar servidor
import express from 'express';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";
import './config/db.js';

// Importar as rotas
import medicamentoRoutes from './routes/medicamentosRoutes.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Permite requisições de outros domínios (frontend)
app.use(cors());

// Permite receber JSON no body das requisições
app.use(express.json());

// Permite receber dados de formulários
app.use(express.urlencoded({extended: true}));

// Middleware para Content-Type correto - ANTES do express.static
app.use((req, res, next) => {
  if (req.path.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
  } else if (req.path.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  }
  next();
});

// Servir arquivos estáticos da pasta frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotas da API
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/usuarios', userRoutes);

// Rotas das páginas HTML
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, '../frontend/assets/pages/home.html'));
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/assets/pages/login.html'));
});

app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/assets/pages/cadastro.html'));
});

app.get('/medicamentos',(req,res)=>{
    res.sendFile(path.join(__dirname,'../frontend/assets/pages/medicamentos.html'))
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});

export default app;