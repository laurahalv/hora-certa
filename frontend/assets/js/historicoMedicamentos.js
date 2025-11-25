// historicoMedicamentos.js - Gerenciar histórico de medicamentos

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(carregarHistorico, 250);
  });

  async function carregarHistorico() {
    const usuarioLogado = localStorage.getItem('usuario');
    
    if (!usuarioLogado) {
      console.log('❌ Usuário não está logado');
      return;
    }

    const usuario = JSON.parse(usuarioLogado);
    
    // Pega o quarto card (histórico)
    const cards = document.querySelectorAll('.card');
    const cardHistorico = cards[3]; // Quarto card
    
    if (!cardHistorico) {
      console.error('Card de histórico não encontrado');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/medicamentos/usuario/${usuario.id}`);
      const data = await response.json();

      if (data.sucesso && data.dados.length > 0) {
        const historico = gerarHistorico(data.dados);
        exibirHistorico(historico, cardHistorico);
      } else {
        exibirHistoricoVazio(cardHistorico);
      }

    } catch (error) {
      console.error('❌ Erro ao carregar histórico:', error);
    }
  }

  function gerarHistorico(medicamentos) {
    const hoje = new Date();
    const historico = [];

    medicamentos.forEach(med => {
      if (!med.horarios || med.horarios.length === 0) return;

      med.horarios.forEach((horarioObj, index) => {
        const horaAtual = `${String(hoje.getHours()).padStart(2, '0')}:${String(hoje.getMinutes()).padStart(2, '0')}`;
        
        // Só mostra horários que já passaram
        if (horarioObj.hora <= horaAtual) {
          const tomado = verificarSeTomouHoje(med._id, horarioObj.hora);
          
          historico.push({
            medicamento: med.nome,
            dose: med.dosagem,
            pessoa: 'Você',
            horario: horarioObj.hora,
            status: tomado ? 'Tomado' : 'Não Tomado',
            tomado: tomado
          });
        }
      });
    });

    // Ordena por horário (mais recente primeiro)
    historico.sort((a, b) => b.horario.localeCompare(a.horario));

    // Limita a 5 entradas mais recentes
    return historico.slice(0, 5);
  }

  function verificarSeTomouHoje(medicamentoId, horario) {
    const hoje = new Date().toDateString();
    const chave = `tomado-${medicamentoId}-${horario}-${hoje}`;
    return localStorage.getItem(chave) === 'true';
  }

  function exibirHistorico(historico, card) {
    let tableContainer = card.querySelector('.table-container');
    
    if (!tableContainer) {
      tableContainer = document.createElement('div');
      tableContainer.className = 'table-container';
      card.appendChild(tableContainer);
    }

    if (historico.length === 0) {
      tableContainer.innerHTML = `
        <div style="padding: 30px; text-align: center;">
          <p style="color: #999; font-size: 14px;">
            Nenhum histórico disponível hoje
          </p>
        </div>
      `;
      return;
    }

    // Cria o cabeçalho da tabela
    let html = `
      <div class="table-row" style="
        display: grid;
        grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1.5fr;
        gap: 10px;
        padding: 10px;
        background: #f5f5f5;
        font-weight: bold;
        border-radius: 5px 5px 0 0;
      ">
        <p style="margin: 0;">Medicamento</p>
        <p style="margin: 0;">Dose</p>
        <p style="margin: 0;">Pessoa</p>
        <p style="margin: 0;">Horário</p>
        <p style="margin: 0;">Status</p>
      </div>
    `;

    // Adiciona cada linha do histórico
    historico.forEach((item, index) => {
      const bgColor = index % 2 === 0 ? '#fff' : '#f9f9f9';
      const statusColor = item.tomado ? '#4CAF50' : '#f44336';
      const statusIcon = item.tomado ? '✓' : '✗';

      html += `
        <div class="table-row-below" style="
          display: grid;
          grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1.5fr;
          gap: 10px;
          padding: 10px;
          background: ${bgColor};
          border-bottom: 1px solid #e0e0e0;
        ">
          <p style="margin: 0; color: #333;">${item.medicamento}</p>
          <p style="margin: 0; color: #666;">${item.dose}</p>
          <p style="margin: 0; color: #666;">${item.pessoa}</p>
          <p style="margin: 0; color: #666;">${item.horario}</p>
          <p style="margin: 0; color: ${statusColor}; font-weight: bold;">
            ${statusIcon} ${item.status}
          </p>
        </div>
      `;
    });

    tableContainer.innerHTML = html;
  }

  function exibirHistoricoVazio(card) {
    let tableContainer = card.querySelector('.table-container');
    
    if (!tableContainer) {
      tableContainer = document.createElement('div');
      tableContainer.className = 'table-container';
      card.appendChild(tableContainer);
    }

    tableContainer.innerHTML = `
      <div style="padding: 30px; text-align: center;">
        <p style="color: #999; font-size: 14px;">
          Cadastre medicamentos para ver o histórico
        </p>
      </div>
    `;
  }

  // Expõe função global
  window.carregarHistorico = carregarHistorico;

})();