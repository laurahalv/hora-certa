import express from "express";
const router = express.Router();

import {cadastrarUsuario,loginUsuario,buscarPerfil,atualizarPerfil,deletarUsuario} from '../controllers/userController.js'

// Cadastrar usuario
router.post('/cadastro',cadastrarUsuario)
// Login usuario
router.post('/login',loginUsuario)
// buscar perfil
router.get('/:id',buscarPerfil)
// atualizar usuario
router.put('/:id', atualizarPerfil)
// deletar usuario
router.delete('/:id',deletarUsuario)

export default router;