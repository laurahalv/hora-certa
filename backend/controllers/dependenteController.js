import Dependente from '../models/Dependente.js';

// CRIAR dependente
export const criarDependente = async (req, res) => {
  try {
    const { nome, parentesco, usuario } = req.body;

    // Validação
    if (!nome || !parentesco || !usuario) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Preencha todos os campos (nome, parentesco, usuario)'
      });
    }

    const novoDependente = await Dependente.create({
      nome,
      parentesco,
      usuario
    });

    res.status(201).json({
      sucesso: true,
      mensagem: 'Dependente adicionado com sucesso!',
      dados: novoDependente
    });
  } catch (erro) {
    console.error('Erro ao criar dependente:', erro);
    res.status(400).json({
      sucesso: false,
      mensagem: 'Erro ao adicionar dependente',
      erro: erro.message
    });
  }
};

// LISTAR todos os dependentes
export const listarDependentes = async (req, res) => {
  try {
    const dependentes = await Dependente.find().populate('usuario', 'nome email');
    
    res.status(200).json({
      sucesso: true,
      quantidade: dependentes.length,
      dados: dependentes
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao listar dependentes',
      erro: erro.message
    });
  }
};

// LISTAR dependentes de um usuário específico
export const listarDependentesPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    const dependentes = await Dependente.find({ usuario: usuarioId });
    
    res.status(200).json({
      sucesso: true,
      quantidade: dependentes.length,
      dados: dependentes
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao listar dependentes do usuário',
      erro: erro.message
    });
  }
};

// BUSCAR dependente por ID
export const buscarDependente = async (req, res) => {
  try {
    const dependente = await Dependente.findById(req.params.id)
      .populate('usuario', 'nome email');

    if (!dependente) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Dependente não encontrado'
      });
    }

    res.status(200).json({
      sucesso: true,
      dados: dependente
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar dependente',
      erro: erro.message
    });
  }
};

// ATUALIZAR dependente
export const atualizarDependente = async (req, res) => {
  try {
    const { nome, parentesco } = req.body;

    const dependenteAtualizado = await Dependente.findByIdAndUpdate(
      req.params.id,
      { nome, parentesco },
      { new: true, runValidators: true }
    );

    if (!dependenteAtualizado) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Dependente não encontrado'
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Dependente atualizado com sucesso!',
      dados: dependenteAtualizado
    });
  } catch (erro) {
    res.status(400).json({
      sucesso: false,
      mensagem: 'Erro ao atualizar dependente',
      erro: erro.message
    });
  }
};

// DELETAR dependente
export const deletarDependente = async (req, res) => {
  try {
    const dependenteDeletado = await Dependente.findByIdAndDelete(req.params.id);

    if (!dependenteDeletado) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Dependente não encontrado'
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Dependente removido com sucesso!'
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao deletar dependente',
      erro: erro.message
    });
  }
};