// authCheck.js - Proteção simples SEM JWT
// Adicione este script em TODAS as páginas protegidas

(function() {
  // Verifica se o usuário está logado
  const logado = localStorage.getItem('logado');
  const usuario = localStorage.getItem('usuario');

  if (!logado || !usuario) {
    // Se não estiver logado, redireciona para login
    alert('Você precisa fazer login para acessar esta página!');
    window.location.href = '/login';
    return;
  }

  // Função para fazer logout (disponível globalmente)
  window.logout = function() {
    if (confirm('Deseja realmente sair?')) {
      localStorage.removeItem('logado');
      localStorage.removeItem('usuario');
      window.location.href = '/';
    }
  };

  // Função para pegar dados do usuário logado
  window.getUsuarioLogado = function() {
    try {
      return JSON.parse(localStorage.getItem('usuario'));
    } catch {
      return null;
    }
  };

  // Exibe mensagem de boas-vindas no console
  const usuarioObj = JSON.parse(usuario);
  console.log(`✅ Usuário logado: ${usuarioObj.nome} (${usuarioObj.email})`);

})();