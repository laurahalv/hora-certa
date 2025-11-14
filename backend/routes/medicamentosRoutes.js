import express from 'express';
const router = express.Router();

import {
  criarMedicamento,
  listarMedicamentos,
  buscarMedicamento,
  atualizarMedicamento,
  deletarMedicamento
} from '../controllers/medicamentosController.js';


// criar Medicamento
router.post('/',criarMedicamento)
// listar todos os medicamentos
router.get('/',listarMedicamentos)
// Buscar medicamento especifico
router.get('/:id', buscarMedicamento)
// atualizar
router.put('/:id',atualizarMedicamento)
// deletar
router.delete('/:id',deletarMedicamento)

export default router;

