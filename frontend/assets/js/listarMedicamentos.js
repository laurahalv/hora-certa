// listarMedicamentos.js - Busca e exibe os medicamentos no card

// Função para buscar medicamentos do usuário logado
async function carregarMedicamentos() {
  const usuarioLogado = localStorage.getItem('usuario');
  
  if (!usuarioLogado) {
    console.log('❌ Usuário não está logado');
    return;
  }

  const usuario = JSON.parse(usuarioLogado);
  
  // Pega o card de "Próximos Medicamentos"
  const card = document.querySelector('.card');
  if (!card) {
    console.error('Card não encontrado');
    return;
  }

  // Substitui o conteúdo do card por loading
  const imgContainer = card.querySelector('.img-container');
  const baselineTextContainer = card.querySelector('.baseline-text-container');
  
  if (baselineTextContainer) {
    baselineTextContainer.innerHTML = '<p class="cardg-title" style="color: #666;">Carregando...</p>';
  }

  try {
    // Busca os medicamentos do usuário
    const response = await fetch(`http://localhost:3000/api/medicamentos/usuario/${usuario.id}`);
    const data = await response.json();

    if (data.sucesso && data.dados.length > 0) {
      console.log('✅ Medicamentos carregados:', data.dados);
      
      // Esconde a imagem e texto padrão
      if (imgContainer) imgContainer.style.display = 'none';
      if (baselineTextContainer) baselineTextContainer.style.display = 'none';
      
      // Cria lista de medicamentos
      exibirMedicamentosNoCard(data.dados, card);
      
    } else {
      // Nenhum medicamento - mantém mensagem padrão
      if (imgContainer) imgContainer.style.display = 'flex';
      if (baselineTextContainer) {
        baselineTextContainer.style.display = 'block';
        baselineTextContainer.innerHTML = '<p class="cardg-title">Nenhum Medicamento Agendado</p>';
      }
    }

  } catch (error) {
    console.error('❌ Erro ao carregar medicamentos:', error);
    if (baselineTextContainer) {
      baselineTextContainer.innerHTML = '<p class="cardg-title" style="color: #c33;">Erro ao carregar</p>';
    }
  }
}

// Função para exibir medicamentos no card
function exibirMedicamentosNoCard(medicamentos, card) {
  // Remove container de lista se já existir
  let listaContainer = card.querySelector('.medicamentos-lista');
  if (listaContainer) {
    listaContainer.remove();
  }

  // Cria novo container para a lista
  listaContainer = document.createElement('div');
  listaContainer.className = 'medicamentos-lista';
  listaContainer.style.cssText = `
    padding: 10px;
    max-height: 400px;
    overflow-y: auto;
  `;

  // Adiciona cada medicamento
  medicamentos.forEach((med, index) => {
    const proximoHorario = med.horarios && med.horarios.length > 0 
      ? med.horarios[0].hora 
      : '--:--';

    const itemMed = document.createElement('div');
    itemMed.className = 'medicamento-item';
    itemMed.style.cssText = `
      background: ${index % 2 === 0 ? '#f9f9f9' : '#fff'};
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 8px;
      border-left: 4px solid #3f51b5;
      transition: all 0.2s;
    `;

    itemMed.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div style="flex: 1;">
          <h4 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">${med.nome}</h4>
          <p style="margin: 3px 0; color: #666; font-size: 13px;">
            <strong>Dose:</strong> ${med.dosagem}
          </p>
          <p style="margin: 3px 0; color: #666; font-size: 13px;">
            <strong>Frequência:</strong> ${med.frequencia}
          </p>
          <p style="margin: 3px 0; color: #4CAF50; font-size: 13px; font-weight: bold;">
            ⏰ ${proximoHorario}
          </p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 5px;">
          <button 
            class="btn-editar-med" 
            data-id="${med._id}"
            title="Editar"
            style="
              background: #2196F3;
              color: white;
              border: none;
              padding: 6px 12px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 12px;
            "
          >
            ✏️ Editar
          </button>
          <button 
            class="btn-deletar-med" 
            data-id="${med._id}"
            title="Excluir"
            style="
              background: #f44336;
              color: white;
              border: none;
              padding: 6px 12px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 12px;
            "
          >
            🗑️ Excluir
          </button>
        </div>
      </div>
    `;

    // Hover effect
    itemMed.addEventListener('mouseenter', () => {
      itemMed.style.transform = 'translateX(5px)';
      itemMed.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    });
    
    itemMed.addEventListener('mouseleave', () => {
      itemMed.style.transform = 'translateX(0)';
      itemMed.style.boxShadow = 'none';
    });

    listaContainer.appendChild(itemMed);
  });

  // Adiciona o container ao card
  card.appendChild(listaContainer);

  // Adiciona eventos aos botões
  adicionarEventosBotoes();
}

// Função para adicionar eventos aos botões
function adicionarEventosBotoes() {
  // Botões de deletar
  document.querySelectorAll('.btn-deletar-med').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.closest('button').dataset.id;
      
      if (confirm('Tem certeza que deseja excluir este medicamento?')) {
        try {
          const response = await fetch(`http://localhost:3000/api/medicamentos/${id}`, {
            method: 'DELETE'
          });

          const data = await response.json();

          if (data.sucesso) {
            alert('✅ Medicamento excluído com sucesso!');
            carregarMedicamentos(); // Recarrega a lista
          } else {
            alert('❌ Erro ao excluir medicamento');
          }
        } catch (error) {
          console.error('Erro:', error);
          alert('❌ Erro ao excluir medicamento');
        }
      }
    });
  });

  // Botões de editar
  document.querySelectorAll('.btn-editar-med').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.closest('button').dataset.id;
      alert(`🔧 Função de editar em desenvolvimento.\nID: ${id}`);
      // TODO: Implementar edição
    });
  });
}

// Carrega os medicamentos quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
  // Aguarda um pouco para garantir que o authCheck executou
  setTimeout(carregarMedicamentos, 100);
});

// Exporta a função para poder chamar de outros arquivos
window.carregarMedicamentos = carregarMedicamentos;