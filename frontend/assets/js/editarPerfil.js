// editarPerfil.js - Permitir edição de nome e email

// Adiciona botão de editar após carregar os dados
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(adicionarBotaoEditar, 500);
});

function adicionarBotaoEditar() {
  const dadosPessoaisBox = document.querySelector('.box');
  
  if (!dadosPessoaisBox) return;

  // Verifica se já existe o botão
  if (document.getElementById('btnEditarPerfil')) return;

  const btnEditar = document.createElement('button');
  btnEditar.id = 'btnEditarPerfil';
  btnEditar.className = 'button';
  btnEditar.textContent = 'Editar Perfil';
  btnEditar.style.cssText = `
    margin-top: 20px;
    background: #2196F3;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: background 0.3s;
  `;

  btnEditar.addEventListener('mouseenter', () => {
    btnEditar.style.background = '#1976D2';
  });

  btnEditar.addEventListener('mouseleave', () => {
    btnEditar.style.background = '#2196F3';
  });

  btnEditar.addEventListener('click', abrirModalEdicao);

  dadosPessoaisBox.appendChild(btnEditar);
}

function abrirModalEdicao() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // Cria modal
  const modal = document.createElement('div');
  modal.id = 'modalEditarPerfil';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  modal.innerHTML = `
    <div style="
      background: white;
      padding: 30px;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    ">
      <h2 style="margin: 0 0 20px 0; color: #333;">Editar Perfil</h2>
      
      <div id="mensagemEdicao" style="display: none; padding: 10px; border-radius: 5px; margin-bottom: 15px;"></div>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">Nome:</label>
        <input 
          type="text" 
          id="editNome" 
          value="${usuario.nome || ''}"
          style="
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
          "
        >
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">Email:</label>
        <input 
          type="email" 
          id="editEmail" 
          value="${usuario.email || ''}"
          style="
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
          "
        >
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #555;">Nova Senha (opcional):</label>
        <input 
          type="password" 
          id="editSenha" 
          placeholder="Deixe em branco para não alterar"
          style="
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
          "
        >
      </div>

      <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 25px;">
        <button 
          id="btnCancelarEdicao"
          style="
            padding: 10px 20px;
            background: #ccc;
            color: #333;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          "
        >
          Cancelar
        </button>
        <button 
          id="btnSalvarEdicao"
          style="
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
          "
        >
          Salvar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Eventos
  document.getElementById('btnCancelarEdicao').addEventListener('click', () => {
    modal.remove();
  });

  document.getElementById('btnSalvarEdicao').addEventListener('click', salvarEdicaoPerfil);

  // Fechar ao clicar fora
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

async function salvarEdicaoPerfil() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const btnSalvar = document.getElementById('btnSalvarEdicao');
  const mensagemDiv = document.getElementById('mensagemEdicao');

  const novoNome = document.getElementById('editNome').value.trim();
  const novoEmail = document.getElementById('editEmail').value.trim();
  const novaSenha = document.getElementById('editSenha').value;

  // Validações
  if (!novoNome || !novoEmail) {
    mostrarMensagemModal('Preencha nome e email!', 'erro');
    return;
  }

  if (novaSenha && novaSenha.length < 6) {
    mostrarMensagemModal('A senha deve ter no mínimo 6 caracteres!', 'erro');
    return;
  }

  btnSalvar.disabled = true;
  btnSalvar.textContent = 'Salvando...';

  try {
    const dadosAtualizacao = {
      nome: novoNome,
      email: novoEmail
    };

    if (novaSenha) {
      dadosAtualizacao.senha = novaSenha;
    }

    const response = await fetch(`http://localhost:3000/api/usuarios/perfil/${usuario.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosAtualizacao)
    });

    const data = await response.json();

    if (data.sucesso) {
      mostrarMensagemModal('Perfil atualizado com sucesso!', 'sucesso');

      // Atualiza localStorage
      const usuarioAtualizado = data.dados || data.usuario;
      localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));

      // Atualiza a página
      setTimeout(() => {
        document.getElementById('modalEditarPerfil').remove();
        window.location.reload();
      }, 1500);

    } else {
      mostrarMensagemModal(data.mensagem || 'Erro ao atualizar perfil', 'erro');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
    mostrarMensagemModal('Erro de conexão. Tente novamente.', 'erro');
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.textContent = 'Salvar';
  }
}

function mostrarMensagemModal(texto, tipo) {
  const mensagemDiv = document.getElementById('mensagemEdicao');
  
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

  setTimeout(() => {
    mensagemDiv.style.display = 'none';
  }, 5000);
}