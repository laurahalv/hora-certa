// addMedicamento.js - Gerenciar modal e envio de medicamentos

const modalmed = document.querySelector('.modal-med');
const btnCheckmed = document.querySelector('.botao-agendar');
const btnCancelmed = document.querySelector('.btn-back');
const btnAdd = document.querySelector('.btn-add');

// Pega os inputs do modal
const inputNome = document.getElementById('modal-med-name');
const inputDose = document.getElementById('modal-med-dose');
const inputFrequencia = document.getElementById('modal-med-freq');
const inputHorario = document.getElementById('modal-med-horario-dose');

// Abrir/Fechar modal
document.addEventListener('click', (e) => {
  const el = e.target;
  
  // Abre o modal
  if (el.closest('.botao-agendar')) {
    modalmed.style.display = 'block';
  }
  
  // Fecha o modal (botão cancelar)
  if (el.closest('.btn-back')) {
    modalmed.style.display = 'none';
    limparFormulario();
  }
});

// Fecha o modal clicando fora
modalmed?.addEventListener('click', (e) => {
  if (e.target === modalmed) {
    modalmed.style.display = 'none';
    limparFormulario();
  }
});

// Função para limpar o formulário
function limparFormulario() {
  if (inputNome) inputNome.value = '';
  if (inputDose) inputDose.value = '';
  if (inputFrequencia) inputFrequencia.value = '';
  if (inputHorario) inputHorario.value = '';
}

// Função para exibir mensagens
function exibirMensagem(texto, tipo) {
  // Cria ou pega a div de mensagem
  let mensagemDiv = document.querySelector('.mensagem-modal');
  
  if (!mensagemDiv) {
    mensagemDiv = document.createElement('div');
    mensagemDiv.className = 'mensagem-modal';
    const contentMed = document.querySelector('.content-med');
    contentMed.insertBefore(mensagemDiv, contentMed.firstChild);
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

  // Remove a mensagem após 5 segundos
  setTimeout(() => {
    mensagemDiv.style.display = 'none';
  }, 5000);
}

// Evento de clique no botão "Agendar"
btnAdd?.addEventListener('click', async (e) => {
  e.preventDefault();

  // Pega os valores dos inputs
  const nome = inputNome?.value.trim();
  const dose = inputDose?.value.trim();
  const frequencia = inputFrequencia?.value.trim();
  const horario = inputHorario?.value;

  // Validações
  if (!nome || !dose || !frequencia || !horario) {
    exibirMensagem('Preencha todos os campos!', 'erro');
    return;
  }

  // Pega o ID do usuário logado
  const usuarioLogado = localStorage.getItem('usuario');
  if (!usuarioLogado) {
    exibirMensagem('Você precisa estar logado!', 'erro');
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
    return;
  }

  const usuario = JSON.parse(usuarioLogado);

  // Desabilita o botão
  const textoOriginal = btnAdd.textContent;
  btnAdd.disabled = true;
  btnAdd.textContent = 'Agendando...';

  try {
    // Prepara os dados no formato correto
    const dadosMedicamento = {
      nome: nome,
      dosagem: dose,
      frequencia: frequencia,
      horarios: [
        {
          hora: horario,
          tomado: false
        }
      ], // Array de objetos como o Model espera
      usuario: usuario.id, // Campo obrigatório no Model
      usuarioId: usuario.id // Você tem os dois campos no Model
    };

    // DEBUG: Mostra os dados que serão enviados
    console.log('📤 Enviando para o servidor:', dadosMedicamento);

    // Envia os dados para o backend
    const response = await fetch('http://localhost:3000/api/medicamentos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosMedicamento)
    });

    const data = await response.json();

    // DEBUG: Mostra a resposta do servidor
    console.log('📥 Resposta do servidor:', data);
    console.log('Status:', response.status);

    if (data.sucesso || response.ok) {
      exibirMensagem('Medicamento agendado com sucesso!', 'sucesso');
      console.log('✅ Medicamento adicionado:', data);

      // Limpa o formulário
      limparFormulario();

      // Fecha o modal após 1.5 segundos
      setTimeout(() => {
        modalmed.style.display = 'none';
        
        // Recarrega a página para mostrar o novo medicamento
        window.location.reload();
      }, 1500);

    } else {
      exibirMensagem(data.mensagem || 'Erro ao agendar medicamento', 'erro');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
    exibirMensagem('Erro de conexão. Verifique se o servidor está rodando.', 'erro');
  } finally {
    // Reabilita o botão
    btnAdd.disabled = false;
    btnAdd.textContent = textoOriginal;
  }
});