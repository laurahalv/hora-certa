import Medicamento from "../models/Medicamento.js";

// CRIAR medicamento
export const criarMedicamento = async (req, res) => {
  try {
    const { nome, dosagem, frequencia, horarios, usuario, usuarioId } = req.body;
    
    // Validação básica
    if (!nome || !dosagem || !frequencia || !horarios || !usuario) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Preencha todos os campos obrigatórios (nome, dosagem, frequencia, horarios, usuario)'
      });
    }

    const novoMedicamento = await Medicamento.create({
      nome,
      dosagem,
      frequencia,
      horarios,
      usuario,
      usuarioId
    });

    res.status(201).json({
      sucesso: true,
      mensagem: 'Medicamento criado com sucesso!',
      dados: novoMedicamento
    });
  } catch (e) {
    console.error('Erro ao criar medicamento:', e);
    res.status(400).json({
      sucesso: false,
      mensagem: 'Erro ao criar medicamento',
      erro: e.message
    });
  }
};

// LISTAR todos os medicamentos
export const listarMedicamentos = async (req, res) => {
  try {
    const medicamentos = await Medicamento.find();
    res.status(200).json({
      sucesso: true,
      quantidade: medicamentos.length,
      dados: medicamentos
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao listar medicamentos',
      erro: erro.message
    });
  }
};

// LISTAR medicamentos de um usuário específico
export const listarMedicamentosPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    const medicamentos = await Medicamento.find({ usuario: usuarioId })
      .populate('usuario', 'nome email'); // Popula os dados do usuário
    
    res.status(200).json({
      sucesso: true,
      quantidade: medicamentos.length,
      dados: medicamentos
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao listar medicamentos do usuário',
      erro: erro.message
    });
  }
};

// BUSCAR medicamento por ID
export const buscarMedicamento = async (req, res) => {
  try {
    const medicamento = await Medicamento.findById(req.params.id)
      .populate('usuario', 'nome email');

    if (!medicamento) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Medicamento não encontrado'
      });
    }

    res.status(200).json({
      sucesso: true,
      dados: medicamento
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar medicamento',
      erro: erro.message
    });
  }
};

// ATUALIZAR medicamento
export const atualizarMedicamento = async (req, res) => {
  try {
    const medicamentoAtualizado = await Medicamento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // runValidators valida os dados
    );

    if (!medicamentoAtualizado) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Medicamento não encontrado'
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Medicamento atualizado!',
      dados: medicamentoAtualizado
    });
  } catch (erro) {
    res.status(400).json({
      sucesso: false,
      mensagem: 'Erro ao atualizar medicamento',
      erro: erro.message
    });
  }
};

// DELETAR medicamento
export const deletarMedicamento = async (req, res) => {
  try {
    const medicamentoDeletado = await Medicamento.findByIdAndDelete(req.params.id);

    if (!medicamentoDeletado) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Medicamento não encontrado'
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Medicamento deletado com sucesso!'
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao deletar medicamento',
      erro: erro.message
    });
  }
};