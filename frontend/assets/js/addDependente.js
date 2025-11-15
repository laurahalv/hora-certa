// addDependente.js - Sistema completo de dependentes

const modal = document.querySelector('.modal');
const btnCheck = document.querySelector('.dependent-check');
const btnCancel = document.querySelector('.back');
const btnAdd = document.querySelector('.add');
const inputNome = document.getElementById('modal-name');
const inputParentesco = document.getElementById('modal-parent');

// Abrir/Fechar modal
document.addEventListener('click', (e) => {
  const el = e.target;
  
  if (el.closest('.dependent-check')) {
    modal.style.display = 'block';
  }
  
  if (el.closest('.back')) {
    modal.style.display = 'none';
    limparFormulario();
  }
});

// Fecha modal clicando fora
modal?.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    limparFormulario();
  }
});

// Limpar formulário
function limparFormulario() {
  if (inputNome) inputNome.value = '';
  if (inputParentesco) inputParentesco.value = '';
}

// Função para exibir mensagens
function exibirMensagem(texto, tipo) {
  let mensagemDiv = document.querySelector('.mensagem-dependente');
  
  if (!mensagemDiv) {
    mensagemDiv = document.createElement('div');
    mensagemDiv.className = 'mensagem-dependente';
    const content = document.querySelector('.content');
    content.insertBefore(mensagemDiv, content.firstChild);
  }

  mensagemDiv.textContent = texto;
  mensagemDiv.style.display = 'block';
  mensagemDiv.style.padding = '10px';
  mensagemDiv.style.borderRadius = '5px';
  mensagemDiv.style.marginBottom = '15px';
  mensagemDiv.style.textAlign = 'center';
  
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

// Adicionar dependente
btnAdd?.addEventListener('click', async (e) => {
  e.preventDefault();

  const nome = inputNome?.value.trim();
  const parentesco = inputParentesco?.value.trim();

  if (!nome || !parentesco) {
    exibirMensagem('Preencha todos os campos!', 'erro');
    return;
  }

  const usuarioLogado = localStorage.getItem('usuario');
  if (!usuarioLogado) {
    exibirMensagem('Você precisa estar logado!', 'erro');
    setTimeout(() => window.location.href = '/login', 2000);
    return;
  }

  const usuario = JSON.parse(usuarioLogado);

  const textoOriginal = btnAdd.textContent;
  btnAdd.disabled = true;
  btnAdd.textContent = 'Adicionando...';

  try {
    const response = await fetch('http://localhost:3000/api/dependentes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: nome,
        parentesco: parentesco,
        usuario: usuario.id
      })
    });

    const data = await response.json();

    if (data.sucesso) {
      exibirMensagem('Dependente adicionado com sucesso!', 'sucesso');
      console.log('✅ Dependente adicionado:', data.dados);

      limparFormulario();

      setTimeout(() => {
        modal.style.display = 'none';
        if (window.carregarDependentes) {
          window.carregarDependentes();
        }
      }, 1500);

    } else {
      exibirMensagem(data.mensagem || 'Erro ao adicionar dependente', 'erro');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
    exibirMensagem('Erro de conexão. Verifique se o servidor está rodando.', 'erro');
  } finally {
    btnAdd.disabled = false;
    btnAdd.textContent = textoOriginal;
  }
});