// testarNotificacao.js - Adiciona botão para testar notificações

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    // Adiciona botão apenas na página de medicamentos
    if (window.location.pathname.includes('medicamentos')) {
      setTimeout(adicionarBotaoTesteNotificacao, 1000);
    }
  });

  function adicionarBotaoTesteNotificacao() {
    // Verifica se já existe
    if (document.getElementById('btnTestarNotif')) return;

    const botaoAgendar = document.querySelector('.botao-agendar-med');
    
    if (!botaoAgendar) return;

    // Cria o botão
    const btnTeste = document.createElement('button');
    btnTeste.id = 'btnTestarNotif';
    btnTeste.className = 'botao-teste-notif';
    btnTeste.innerHTML = '🔔 Testar Notificação';
    btnTeste.style.cssText = `
      background: #FF9800;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      margin-left: 10px;
      transition: all 0.3s;
    `;

    btnTeste.addEventListener('mouseenter', () => {
      btnTeste.style.background = '#F57C00';
      btnTeste.style.transform = 'translateY(-2px)';
    });

    btnTeste.addEventListener('mouseleave', () => {
      btnTeste.style.background = '#FF9800';
      btnTeste.style.transform = 'translateY(0)';
    });

    btnTeste.addEventListener('click', testarNotificacao);

    botaoAgendar.appendChild(btnTeste);
  }

  async function testarNotificacao() {
    const btn = document.getElementById('btnTestarNotif');
    
    // Verifica se tem permissão
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        alert('❌ Você precisa permitir notificações para usar esta funcionalidade!');
        return;
      }
    }

    // Desabilita o botão temporariamente
    btn.disabled = true;
    btn.textContent = '⏳ Enviando...';

    // Busca um medicamento de exemplo
    const usuarioLogado = localStorage.getItem('usuario');
    
    if (!usuarioLogado) {
      alert('Você precisa estar logado!');
      btn.disabled = false;
      btn.textContent = '🔔 Testar Notificação';
      return;
    }

    const usuario = JSON.parse(usuarioLogado);

    try {
      const response = await fetch(`http://localhost:3000/api/medicamentos/usuario/${usuario.id}`);
      const data = await response.json();

      let medicamento;
      
      if (data.sucesso && data.dados.length > 0) {
        // Usa o primeiro medicamento
        medicamento = data.dados[0];
      } else {
        // Cria um exemplo se não tiver medicamentos
        medicamento = {
          nome: 'Medicamento Exemplo',
          dosagem: '1 comprimido',
          horarios: [{ hora: '08:00' }]
        };
      }

      // Envia notificação de teste
      const notification = new Notification('💊 Teste de Notificação', {
        body: `${medicamento.nome} - ${medicamento.dosagem}\nEsta é uma notificação de teste!`,
        icon: '/assets/images/medicamento.png',
        badge: '/assets/images/horacerta-logo.png',
        requireInteraction: false
      });

      // Toca som se habilitado
      const preferencias = JSON.parse(localStorage.getItem('preferencias')) || {};
      if (preferencias.lembretesSonoros) {
        const audio = new Audio('assets/audio/kex05hnewb9-bell-ringing-sfx-2.mp3');
        audio.play().catch(e => console.log('Som não disponível'));
      }

      notification.onclick = function() {
        window.focus();
        notification.close();
      };

      // Fecha automaticamente após 5 segundos
      setTimeout(() => notification.close(), 5000);

      // Feedback visual
      btn.textContent = '✅ Enviada!';
      btn.style.background = '#4CAF50';

      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = '🔔 Testar Notificação';
        btn.style.background = '#FF9800';
      }, 2000);

    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar notificação de teste');
      btn.disabled = false;
      btn.textContent = '🔔 Testar Notificação';
    }
  }

})();