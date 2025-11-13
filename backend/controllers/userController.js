// 1. Importa o Model de User (vamos criar depois)
import User from '../models/User.js';


// CRIAR 
export const cadastrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, telefone } = req.body;
    
    // Verifica se o email já existe
    const usuarioExistente = await User.findOne({ email });
    
    if (usuarioExistente) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Este email já está cadastrado'
      });
    }
    
    // Cria o novo usuário
    const novoUsuario = await User.create({
      nome,
      email,
      senha, 
      telefone
    });
    
    // Remove a senha da resposta (segurança)
    const usuarioSemSenha = novoUsuario.toObject();
    delete usuarioSemSenha.senha;
    
    res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário cadastrado com sucesso!',
      dados: usuarioSemSenha
    });
    
  } catch (erro) {
    res.status(400).json({
      sucesso: false,
      mensagem: 'Erro ao cadastrar usuário',
      erro: erro.message
    });
  }
};


// LOGIN 

export const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    // Busca o usuário pelo email
    const usuario = await User.findOne({ email });
    
    if (!usuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Email ou senha incorretos'
      });
    }
    
    if (usuario.senha !== senha) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Email ou senha incorretos'
      });
    }
    
    // Remove a senha da resposta
    const usuarioSemSenha = usuario.toObject();
    delete usuarioSemSenha.senha;
    
    res.status(200).json({
      sucesso: true,
      mensagem: 'Login realizado com sucesso!',
      dados: usuarioSemSenha
    });
    
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao fazer login',
      erro: erro.message
    });
  }
};


// BUSCAR perfil do usuário

export const buscarPerfil = async (req, res) => {
  try {
    // req.params.id vem da URL
    const usuario = await User.findById(req.params.id).select('-senha');
    // .select('-senha') = não retorna o campo senha
    
    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }
    
    res.status(200).json({
      sucesso: true,
      dados: usuario
    });
    
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar perfil',
      erro: erro.message
    });
  }
};


// ATUALIZAR 

export const atualizarPerfil = async (req, res) => {
  try {
    const { nome, telefone } = req.body;
    
    // Atualiza apenas nome e telefone (não deixa mudar email/senha aqui)
    const usuarioAtualizado = await User.findByIdAndUpdate(
      req.params.id,
      { nome, telefone },
      { new: true }
    ).select('-senha');
    
    if (!usuarioAtualizado) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }
    
    res.status(200).json({
      sucesso: true,
      mensagem: 'Perfil atualizado com sucesso!',
      dados: usuarioAtualizado
    });
    
  } catch (erro) {
    res.status(400).json({
      sucesso: false,
      mensagem: 'Erro ao atualizar perfil',
      erro: erro.message
    });
  }
};

// DELETAR usuário

export const deletarUsuario = async (req, res) => {
  try {
    const usuarioDeletado = await User.findByIdAndDelete(req.params.id);
    
    if (!usuarioDeletado) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }
    
    res.status(200).json({
      sucesso: true,
      mensagem: 'Usuário deletado com sucesso!'
    });
    
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao deletar usuário',
      erro: erro.message
    });
  }
};
