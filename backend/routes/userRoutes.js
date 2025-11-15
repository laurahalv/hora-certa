import express from "express";
import { 
  cadastrarUsuario, 
  loginUsuario, 
  buscarPerfil, 
  atualizarPerfil, 
  deletarUsuario 
} from '../controllers/userController.js';

const router = express.Router();

// Todas as rotas são públicas (sem proteção)
router.post('/cadastro', cadastrarUsuario);
router.post('/login', loginUsuario);
router.get('/perfil/:id', buscarPerfil);
router.put('/perfil/:id', atualizarPerfil);
router.delete('/perfil/:id', deletarUsuario);

export default router;