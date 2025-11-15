// login.js - Sistema simples sem JWT

document.addEventListener('DOMContentLoaded', function() {
  
  // Verifica se já está logado
  const usuarioLogado = localStorage.getItem('usuario');
  if (usuarioLogado) {
    // Se já está logado, redireciona para medicamentos
    window.location.href = '/medicamentos';
    return;
  }

  // Pega os elementos do formulário
  const form = document.getElementById('form');
  const inputEmail = document.getElementById('email');
  const inputSenha = document.getElementById('password');
  const btnSubmit = document.getElementById('btnLogin');

  // Cria uma div para mensagens se não existir
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

  // Função para exibir mensagens
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

  // Função para limpar mensagem
  function limparMensagem() {
    mensagemDiv.textContent = '';
    mensagemDiv.style.display = 'none';
  }

  // Evento de submit do formulário
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    limparMensagem();

    // Pega os valores dos inputs
    const email = inputEmail.value.trim();
    const senha = inputSenha.value;

    // Validação básica
    if (!email || !senha) {
      exibirMensagem('Preencha todos os campos!', 'erro');
      return;
    }

    // Desabilita o botão durante o envio
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Entrando...';

    try {
      // Faz a requisição para o backend
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          senha: senha
        })
      });

      const data = await response.json();

      if (data.success) {
        // Login bem-sucedido
        exibirMensagem('Login realizado com sucesso!', 'sucesso');
        
        // Salva APENAS os dados do usuário no localStorage
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        localStorage.setItem('logado', 'true');

        console.log('Login bem-sucedido:', data.usuario);

        // Redireciona após 1 segundo
        setTimeout(() => {
          window.location.href = '/medicamentos';
        }, 1000);

      } else {
        // Erro retornado pelo servidor
        exibirMensagem(data.message || 'Erro ao fazer login', 'erro');
      }

    } catch (error) {
      // Erro de rede ou outro erro
      console.error('Erro:', error);
      exibirMensagem('Erro de conexão. Tente novamente.', 'erro');
    } finally {
      // Reabilita o botão
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Entrar';
    }
  });

  // Limpa a mensagem quando o usuário começa a digitar
  inputEmail.addEventListener('input', limparMensagem);
  inputSenha.addEventListener('input', limparMensagem);

});