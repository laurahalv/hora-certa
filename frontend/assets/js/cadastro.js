// cadastro.js - Adaptado para sua página de cadastro

document.addEventListener('DOMContentLoaded', function() {
  
  // Se já está logado, redireciona
  const usuarioLogado = localStorage.getItem('usuario');
  if (usuarioLogado) {
    window.location.href = '/medicamentos';
    return;
  }

  // Pega os elementos do formulário usando o ID ou seletor
  const form = document.getElementById('formCadastro') || document.querySelector('form');
  const inputNome = document.getElementById('name');
  const inputEmail = document.getElementById('email');
  const inputSenha = document.getElementById('password');
  const inputConfirmarSenha = document.getElementById('confirm_password');
  const btnSubmit = document.querySelector('button[type="submit"]');

  // Cria div para mensagens
  let mensagemDiv = document.getElementById('mensagem');
  if (!mensagemDiv) {
    mensagemDiv = document.createElement('div');
    mensagemDiv.id = 'mensagem';
    mensagemDiv.style.display = 'none';
    mensagemDiv.style.padding = '10px';
    mensagemDiv.style.borderRadius = '5px';
    mensagemDiv.style.marginBottom = '15px';
    mensagemDiv.style.textAlign = 'center';
    form.insertBefore(mensagemDiv, form.firstChild);
  }

  function exibirMensagem(texto, tipo) {
    mensagemDiv.textContent = texto;
    mensagemDiv.style.display = 'block';
    
    if (tipo === 'erro') {
      mensagemDiv.style.backgroundColor = '#fee';
      mensagemDiv.style.color = '#c33';
      mensagemDiv.style.border = '1px solid #fcc';
    } else if (tipo === 'sucesso') {
      mensagemDiv.style.backgroundColor = '#efe';
      mensagemDiv.style.color = '#3c3';
      mensagemDiv.style.border = '1px solid #cfc';
    }
  }

  function limparMensagem() {
    mensagemDiv.textContent = '';
    mensagemDiv.style.display = 'none';
  }

  // Validação em tempo real das senhas
  inputConfirmarSenha.addEventListener('input', function() {
    if (inputSenha.value && inputConfirmarSenha.value) {
      if (inputSenha.value !== inputConfirmarSenha.value) {
        inputConfirmarSenha.setCustomValidity('As senhas não coincidem');
        inputConfirmarSenha.style.borderColor = '#c33';
      } else {
        inputConfirmarSenha.setCustomValidity('');
        inputConfirmarSenha.style.borderColor = '#3c3';
      }
    }
  });

  form.addEventListener('submit', async function(e) {
    e.preventDefault(); // Impede o envio padrão do form
    limparMensagem();

    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();
    const senha = inputSenha.value;
    const confirmarSenha = inputConfirmarSenha.value;

    // Validações
    if (!nome || !email || !senha || !confirmarSenha) {
      exibirMensagem('Preencha todos os campos!', 'erro');
      return;
    }

    if (senha.length < 6) {
      exibirMensagem('A senha deve ter no mínimo 6 caracteres!', 'erro');
      return;
    }

    if (senha !== confirmarSenha) {
      exibirMensagem('As senhas não coincidem!', 'erro');
      return;
    }

    // Desabilita o botão
    const textoOriginal = btnSubmit.textContent;
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Cadastrando...';

    try {
      const response = await fetch('http://localhost:3000/api/usuarios/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          senha: senha,
          telefone: '' // Opcional, você pode adicionar campo de telefone depois
        })
      });

      const data = await response.json();

      if (data.sucesso) {
        exibirMensagem('Cadastro realizado com sucesso! Redirecionando...', 'sucesso');
        
        // Salva os dados do usuário
        localStorage.setItem('usuario', JSON.stringify(data.dados));
        localStorage.setItem('logado', 'true');

        console.log('✅ Cadastro bem-sucedido:', data.dados);

        // Limpa o formulário
        form.reset();

        // Redireciona após 1.5 segundos
        setTimeout(() => {
          window.location.href = '/medicamentos';
        }, 1500);

      } else {
        exibirMensagem(data.mensagem || 'Erro ao cadastrar', 'erro');
      }

    } catch (error) {
      console.error('❌ Erro:', error);
      exibirMensagem('Erro de conexão. Verifique se o servidor está rodando.', 'erro');
    } finally {
      // Reabilita o botão
      btnSubmit.disabled = false;
      btnSubmit.textContent = textoOriginal;
    }
  });

  // Limpa mensagem ao digitar
  [inputNome, inputEmail, inputSenha, inputConfirmarSenha].forEach(input => {
    input.addEventListener('input', limparMensagem);
  });

});