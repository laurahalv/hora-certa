// medicamentosNaoTomados.js - Gerenciar medicamentos não tomados

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(carregarMedicamentosNaoTomados, 200);
  });

  async function carregarMedicamentosNaoTomados() {
    const usuarioLogado = localStorage.getItem('usuario');
    
    if (!usuarioLogado) {
      console.log('❌ Usuário não está logado');
      return;
    }

    const usuario = JSON.parse(usuarioLogado);
    
    // Pega o terceiro card (medicamentos não tomados)
    const cards = document.querySelectorAll('.card');
    const cardNaoTomados = cards[2]; // Terceiro card
    
    if (!cardNaoTomados) {
      console.error('Card de medicamentos não tomados não encontrado');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/medicamentos/usuario/${usuario.id}`);
      const data = await response.json();

      if (data.sucesso && data.dados.length > 0) {
        const medicamentosNaoTomados = filtrarMedicamentosNaoTomados(data.dados);
        exibirMedicamentosNaoTomados(medicamentosNaoTomados, cardNaoTomados);
      } else {
        exibirMensagemVazia(cardNaoTomados);
      }

    } catch (error) {
      console.error('❌ Erro ao carregar medicamentos não tomados:', error);
    }
  }

  function filtrarMedicamentosNaoTomados(medicamentos) {
    const agora = new Date();
    const horaAtual = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
    const dataHoje = agora.toDateString();
    
    const naoTomados = [];

    medicamentos.forEach(med => {
      if (!med.horarios || med.horarios.length === 0) return;

      med.horarios.forEach((horarioObj, index) => {
        // Verifica se o horário já passou
        if (horarioObj.hora <= horaAtual) {
          // Verifica se foi marcado como tomado hoje
          const tomadoHoje = verificarSeTomouHoje(med._id, horarioObj.hora);
          
          if (!tomadoHoje && !horarioObj.tomado) {
            naoTomados.push({
              medicamentoId: med._id,
              nome: med.nome,
              dosagem: med.dosagem,
              horario: horarioObj.hora,
              horarioIndex: index
            });
          }
        }
      });
    });

    return naoTomados;
  }

  function verificarSeTomouHoje(medicamentoId, horario) {
    const hoje = new Date().toDateString();
    const chave = `tomado-${medicamentoId}-${horario}-${hoje}`;
    return localStorage.getItem(chave) === 'true';
  }

  function exibirMedicamentosNaoTomados(naoTomados, card) {
    // Atualiza o título com contador
    const titulo = card.querySelector('.cardg-title');
    if (titulo) {
      titulo.textContent = `Medicamentos não tomados (${naoTomados.length})`;
    }

    // Pega ou cria container
    let container = card.querySelector('.container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'container';
      card.appendChild(container);
    }

    container.innerHTML = '';

    if (naoTomados.length === 0) {
      container.innerHTML = `
        <div style="padding: 30px; text-align: center;">
          <p style="color: #4CAF50; font-size: 16px; font-weight: bold;">
            ✅ Todos os medicamentos foram tomados!
          </p>
        </div>
      `;
      return;
    }

    // Exibe cada medicamento não tomado
    naoTomados.forEach(med => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'caution-content';
      itemDiv.style.cssText = `
        margin-bottom: 15px;
        padding: 15px;
        background: #fff8e1;
        border-left: 4px solid #ff9800;
        border-radius: 5px;
      `;

      itemDiv.innerHTML = `
        <div class="p-informativo">
          <p id="losartana-p" style="margin: 5px 0; font-weight: bold; color: #333; font-size: 16px;">
            ${med.nome}
          </p>
          <p class="caution-p" style="margin: 3px 0; color: #666;">
            Dose: ${med.dosagem}
          </p>
          <p class="caution-p" style="margin: 3px 0; color: #666;">
            Para: Você
          </p>
          <p id="horario" class="caution-p" style="margin: 3px 0; color: #f57c00; font-weight: bold;">
            Horário: ${med.horario}
          </p>
        </div>
        <button 
          class="caution-check btn-marcar-tomado" 
          data-med-id="${med.medicamentoId}"
          data-horario="${med.horario}"
          data-horario-index="${med.horarioIndex}"
          style="
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            width: 100%;
            margin-top: 10px;
            transition: background 0.3s;
          "
        >
          ✓ Marcar como tomado
        </button>
      `;

      container.appendChild(itemDiv);
    });

    // Adiciona eventos aos botões
    adicionarEventosBotoes();
  }

  function exibirMensagemVazia(card) {
    const titulo = card.querySelector('.cardg-title');
    if (titulo) {
      titulo.textContent = 'Medicamentos não tomados (0)';
    }

    let container = card.querySelector('.container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'container';
      card.appendChild(container);
    }

    container.innerHTML = `
      <div style="padding: 30px; text-align: center;">
        <p style="color: #999; font-size: 14px;">
          Nenhum medicamento pendente no momento
        </p>
      </div>
    `;
  }

  function adicionarEventosBotoes() {
    document.querySelectorAll('.btn-marcar-tomado').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.background = '#45a049';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.background = '#4CAF50';
      });

      btn.addEventListener('click', async function() {
        const medicamentoId = this.dataset.medId;
        const horario = this.dataset.horario;
        const horarioIndex = this.dataset.horarioIndex;

        await marcarComoTomado(medicamentoId, horario, horarioIndex, this);
      });
    });
  }

  async function marcarComoTomado(medicamentoId, horario, horarioIndex, botao) {
    const textoOriginal = botao.textContent;
    botao.disabled = true;
    botao.textContent = '⏳ Marcando...';

    try {
      // Busca o medicamento completo
      const response = await fetch(`http://localhost:3000/api/medicamentos/${medicamentoId}`);
      const data = await response.json();

      if (!data.sucesso) {
        throw new Error('Medicamento não encontrado');
      }

      const medicamento = data.dados;

      // Atualiza o horário específico como tomado
      if (medicamento.horarios && medicamento.horarios[horarioIndex]) {
        medicamento.horarios[horarioIndex].tomado = true;
      }

      // Envia atualização para o backend
      const updateResponse = await fetch(`http://localhost:3000/api/medicamentos/${medicamentoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          horarios: medicamento.horarios
        })
      });

      const updateData = await updateResponse.json();

      if (updateData.sucesso) {
        // Marca no localStorage que foi tomado hoje
        const hoje = new Date().toDateString();
        const chave = `tomado-${medicamentoId}-${horario}-${hoje}`;
        localStorage.setItem(chave, 'true');

        // Mostra feedback
        botao.textContent = '✅ Tomado!';
        botao.style.background = '#2196F3';

        // Recarrega a lista após 1 segundo
        setTimeout(() => {
          carregarMedicamentosNaoTomados();
        }, 1000);

        console.log('✅ Medicamento marcado como tomado');
      } else {
        throw new Error('Erro ao atualizar');
      }

    } catch (error) {
      console.error('❌ Erro:', error);
      alert('Erro ao marcar medicamento como tomado');
      botao.disabled = false;
      botao.textContent = textoOriginal;
    }
  }

  // Expõe função global para recarregar
  window.carregarMedicamentosNaoTomados = carregarMedicamentosNaoTomados;

})();