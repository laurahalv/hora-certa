import Medicamento from "../models/Medicamento.js";


// criar medicamento
export const criarMedicamento = async (req, res) => {
    try {
        const { nome, dosagem, frequencia, horarios } = req.body

        const novoMedicamento = await Medicamento.create({
            nome, dosagem, frequencia, horarios
        })
        // Responde com sucesso (status 201 = criado)
        res.status(201).json({
            sucesso: true,
            mensagem: 'Medicamento criado com sucesso!',
            dados: novoMedicamento
        });

    } catch (e) {
        res.status(400).json({
            sucesso: false,
            messagem: 'Erro ao criar medicamento',
            e: e.message
        })
    }
}

// listar
export const listarMedicamentos = async (req, res) => {
    try {
        // Busca todos os medicamentos no banco
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

// listar medicamento por id
export const buscarMedicamento = async (req, res) => {
  try {
    // req.params.id = ID que vem na URL (/api/medicamentos/123)
    const medicamento = await Medicamento.findById(req.params.id);
    
    // Se não encontrar
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

// Atualizar medicamento
export const atualizarMedicamento = async (req, res) => {
  try {
    const medicamentoAtualizado = await Medicamento.findByIdAndUpdate(
      req.params.id,           // ID do medicamento
      req.body,                // Novos dados
      { new: true }            // Retorna o documento atualizado
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


// deletar
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

