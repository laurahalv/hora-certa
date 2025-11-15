import User from '../models/User.js';
import bcrypt from 'bcrypt';

// ========== CADASTRAR USUÁRIO ==========
export const cadastrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Validação básica
    if (!nome || !email || !senha) {
      return res.status(400).json({ 
        success: false,
        message: 'Preencha todos os campos!' 
      });
    }

    // Verifica se o email já existe
    const usuarioExiste = await User.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ 
        success: false,
        message: 'Email já cadastrado!' 
      });
    }

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Cria o usuário
    const novoUsuario = new User({
      nome,
      email,
      senha: senhaCriptografada
    });

    await novoUsuario.save();

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso!',
      usuario: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email
      }
    });

  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao cadastrar usuário' 
    });
  }
};

// ========== LOGIN USUÁRIO ==========
export const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validação básica
    if (!email || !senha) {
      return res.status(400).json({ 
        success: false,
        message: 'Preencha todos os campos!' 
      });
    }

    // Busca o usuário pelo email
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ 
        success: false,
        message: 'Email ou senha incorretos!' 
      });
    }

    // Verifica a senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ 
        success: false,
        message: 'Email ou senha incorretos!' 
      });
    }

    // Retorna os dados do usuário (SEM TOKEN)
    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso!',
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao fazer login' 
    });
  }
};

// ========== BUSCAR PERFIL ==========
export const buscarPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    
    const usuario = await User.findById(id).select('-senha'); // Não retorna a senha
    
    if (!usuario) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuário não encontrado' 
      });
    }

    res.status(200).json({
      success: true,
      usuario
    });

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao buscar perfil' 
    });
  }
};

// ========== ATUALIZAR PERFIL ==========
export const atualizarPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    const dadosAtualizados = { nome, email };

    // Se estiver mudando a senha, criptografa
    if (senha) {
      dadosAtualizados.senha = await bcrypt.hash(senha, 10);
    }

    const usuarioAtualizado = await User.findByIdAndUpdate(
      id,
      dadosAtualizados,
      { new: true }
    ).select('-senha');

    if (!usuarioAtualizado) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuário não encontrado' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Perfil atualizado com sucesso!',
      usuario: usuarioAtualizado
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao atualizar perfil' 
    });
  }
};

// ========== DELETAR USUÁRIO ==========
export const deletarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuarioDeletado = await User.findByIdAndDelete(id);

    if (!usuarioDeletado) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuário não encontrado' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Usuário deletado com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao deletar usuário' 
    });
  }
};