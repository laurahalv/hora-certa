import express from "express";
import { 
  criarMedicamento, 
  listarMedicamentos,
  listarMedicamentosPorUsuario, // NOVO
  buscarMedicamento, 
  atualizarMedicamento, 
  deletarMedicamento 
} from '../controllers/medicamentosController.js';

const router = express.Router();

router.post('/', criarMedicamento);
router.get('/', listarMedicamentos);
router.get('/usuario/:usuarioId', listarMedicamentosPorUsuario); // NOVA ROTA
router.get('/:id', buscarMedicamento);
router.put('/:id', atualizarMedicamento);
router.delete('/:id', deletarMedicamento);

export default router;