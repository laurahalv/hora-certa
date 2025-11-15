import express from "express";
import { 
  criarDependente, 
  listarDependentes,
  listarDependentesPorUsuario,
  buscarDependente, 
  atualizarDependente, 
  deletarDependente 
} from '../controllers/dependenteController.js';

const router = express.Router();

router.post('/', criarDependente);
router.get('/', listarDependentes);
router.get('/usuario/:usuarioId', listarDependentesPorUsuario);
router.get('/:id', buscarDependente);
router.put('/:id', atualizarDependente);
router.delete('/:id', deletarDependente);

export default router;