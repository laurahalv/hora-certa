// perfil-configs.js - Gerenciar perfil e preferências do usuário

document.addEventListener('DOMContentLoaded', async function() {
  
  // Verifica se está logado
  const usuarioLogado = localStorage.getItem('usuario');
  if (!usuarioLogado) {
    alert('Você precisa estar logado para acessar esta página!');
    window.location.href = '/login';
    return;
  }

  const usuario = JSON.parse(usuarioLogado);

  // Buscar dados atualizados do usuário no banco
  await carregarDadosUsuario(usuario.id);

  // Carregar preferências salvas
  carregarPreferencias();

  // Adicionar eventos aos checkboxes
  configurarEventosPreferencias();

  // Adicionar botão de logout
  adicionarBotaoLogout();
});

// Função para buscar dados do usuário no banco
async function carregarDadosUsuario(usuarioId) {
  try {
    // URL correta conforme suas rotas
    const response = await fetch(`http://localhost:3000/api/usuarios/perfil/${usuarioId}`);
    
    // Log para debug
    console.log('📡 Buscando usuário em:', `http://localhost:3000/api/usuarios/perfil/${usuarioId}`);
    
    const data = await response.json();
    
    console.log('📥 Resposta recebida:', data);

    if (data.sucesso) {
      const usuario = data.dados || data.usuario;
      
      // Atualizar nome
      const userNameElement = document.querySelector('.user-name');
      if (userNameElement) {
        userNameElement.textContent = usuario.nome || 'Não informado';
        userNameElement.style.color = '#333';
        userNameElement.style.fontSize = '16px';
      }

      // Atualizar email
      const userEmailElement = document.querySelector('.user-email');
      if (userEmailElement) {
        userEmailElement.textContent = usuario.email || 'Não informado';
        userEmailElement.style.color = '#333';
        userEmailElement.style.fontSize = '16px';
      }

      // Atualizar localStorage com dados mais recentes
      localStorage.setItem('usuario', JSON.stringify(usuario));

      console.log('✅ Dados do usuário carregados:', usuario);
    } else {
      console.error('❌ Erro ao buscar usuário:', data.mensagem);
      usarDadosDoLocalStorage();
    }
  } catch (error) {
    console.error('❌ Erro ao carregar dados do usuário:', error);
    usarDadosDoLocalStorage();
  }
}

// Função auxiliar para usar dados do localStorage se a requisição falhar
function usarDadosDoLocalStorage() {
  const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
  
  if (!usuarioLocal) {
    console.error('❌ Nenhum dado de usuário encontrado!');
    return;
  }

  const userNameElement = document.querySelector('.user-name');
  if (userNameElement) {
    userNameElement.textContent = usuarioLocal.nome || 'Não informado';
    userNameElement.style.color = '#333';
    userNameElement.style.fontSize = '16px';
  }

  const userEmailElement = document.querySelector('.user-email');
  if (userEmailElement) {
    userEmailElement.textContent = usuarioLocal.email || 'Não informado';
    userEmailElement.style.color = '#333';
    userEmailElement.style.fontSize = '16px';
  }

  console.log('ℹ️ Usando dados do localStorage:', usuarioLocal);
}

// Função para carregar preferências salvas no localStorage
function carregarPreferencias() {
  const preferencias = JSON.parse(localStorage.getItem('preferencias')) || {
    alertasMedicamentos: false,
    lembretesSonoros: false,
    lembretesVibratorios: false
  };

  // Selecionar checkboxes
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  
  if (checkboxes[0]) checkboxes[0].checked = preferencias.alertasMedicamentos;
  if (checkboxes[1]) checkboxes[1].checked = preferencias.lembretesSonoros;
  if (checkboxes[2]) checkboxes[2].checked = preferencias.lembretesVibratorios;

  console.log('✅ Preferências carregadas:', preferencias);
}

// Função para salvar preferências quando mudam
function configurarEventosPreferencias() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('change', function() {
      salvarPreferencias();
      
      // Feedback visual
      mostrarNotificacao('Preferência atualizada!', 'sucesso');
    });
  });
}

// Função para salvar preferências no localStorage
function salvarPreferencias() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  const preferencias = {
    alertasMedicamentos: checkboxes[0]?.checked || false,
    lembretesSonoros: checkboxes[1]?.checked || false,
    lembretesVibratorios: checkboxes[2]?.checked || false
  };

  localStorage.setItem('preferencias', JSON.stringify(preferencias));
  console.log('💾 Preferências salvas:', preferencias);
}

// Função para mostrar notificações
function mostrarNotificacao(texto, tipo) {
  // Remove notificação anterior se existir
  const notificacaoAntiga = document.querySelector('.notificacao-perfil');
  if (notificacaoAntiga) {
    notificacaoAntiga.remove();
  }

  // Cria nova notificação
  const notificacao = document.createElement('div');
  notificacao.className = 'notificacao-perfil';
  notificacao.textContent = texto;
  notificacao.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;

  if (tipo === 'sucesso') {
    notificacao.style.backgroundColor = '#4CAF50';
    notificacao.style.color = 'white';
  } else if (tipo === 'erro') {
    notificacao.style.backgroundColor = '#f44336';
    notificacao.style.color = 'white';
  }

  document.body.appendChild(notificacao);

  // Remove após 3 segundos
  setTimeout(() => {
    notificacao.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notificacao.remove(), 300);
  }, 3000);
}

// Adiciona animações CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Função para adicionar botão de logout
function adicionarBotaoLogout() {
  const container = document.querySelector('.container');
  
  if (!container) return;

  const btnLogout = document.createElement('button');
  btnLogout.className = 'button';
  btnLogout.textContent = '🚪 Sair da Conta';
  btnLogout.style.cssText = `
    background: #f44336;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    margin-top: 30px;
    transition: background 0.3s;
  `;

  btnLogout.addEventListener('mouseenter', () => {
    btnLogout.style.background = '#d32f2f';
  });

  btnLogout.addEventListener('mouseleave', () => {
    btnLogout.style.background = '#f44336';
  });

  btnLogout.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja sair?')) {
      localStorage.removeItem('usuario');
      localStorage.removeItem('logado');
      window.location.href = '/';
    }
  });

  container.appendChild(btnLogout);
}