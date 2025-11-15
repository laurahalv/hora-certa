// listarDependentes.js - Exibir dependentes no card

async function carregarDependentes() {
  const usuarioLogado = localStorage.getItem('usuario');
  
  if (!usuarioLogado) {
    console.log('❌ Usuário não está logado');
    return;
  }

  const usuario = JSON.parse(usuarioLogado);
  
  // Pega o card de dependentes (segundo card)
  const cards = document.querySelectorAll('.card');
  const cardDependentes = cards[1]; // Segundo card
  
  if (!cardDependentes) {
    console.error('Card de dependentes não encontrado');
    return;
  }

  const cardContent = cardDependentes.querySelector('.card-content');
  
  if (!cardContent) {
    console.error('card-content não encontrado');
    return;
  }

  // Mostra loading
  cardContent.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Carregando...</p>';

  try {
    const response = await fetch(`http://localhost:3000/api/dependentes/usuario/${usuario.id}`);
    const data = await response.json();

    if (data.sucesso && data.dados.length > 0) {
      console.log('✅ Dependentes carregados:', data.dados);
      exibirDependentes(data.dados, cardContent);
    } else {
      cardContent.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Nenhum dependente cadastrado</p>';
    }

  } catch (error) {
    console.error('❌ Erro ao carregar dependentes:', error);
    cardContent.innerHTML = '<p style="text-align: center; color: #c33; padding: 20px;">Erro ao carregar</p>';
  }
}

function exibirDependentes(dependentes, container) {
  container.innerHTML = '';

  dependentes.forEach(dep => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'p-generico';
    itemDiv.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      margin-bottom: 8px;
      background: #f5f5f5;
      border-radius: 5px;
    `;

    itemDiv.innerHTML = `
      <div>
        <p id="content-p" style="margin: 0; font-weight: bold; color: #333;">${dep.nome}</p>
        <p id="p-c" style="margin: 5px 0 0 0; color: #666; font-size: 14px;">${dep.parentesco}</p>
      </div>
      <button 
        class="btn-remover-dep" 
        data-id="${dep._id}"
        style="
          background: #f44336;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 12px;
        "
      >
        🗑️ Remover
      </button>
    `;

    container.appendChild(itemDiv);
  });

  adicionarEventosRemover();
}

function adicionarEventosRemover() {
  document.querySelectorAll('.btn-remover-dep').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      
      if (confirm('Tem certeza que deseja remover este dependente?')) {
        try {
          const response = await fetch(`http://localhost:3000/api/dependentes/${id}`, {
            method: 'DELETE'
          });

          const data = await response.json();

          if (data.sucesso) {
            alert('✅ Dependente removido com sucesso!');
            carregarDependentes();
          } else {
            alert('❌ Erro ao remover dependente');
          }
        } catch (error) {
          console.error('Erro:', error);
          alert('❌ Erro ao remover dependente');
        }
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(carregarDependentes, 150);
});

window.carregarDependentes = carregarDependentes;