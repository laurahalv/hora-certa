const modalmed = document.querySelector('.modal-med')
const btnCheckmed = document.querySelector('.botao-agendar')
const btnCancelmed = document.querySelector('.btn-back')
    console.log("oi")
document.addEventListener('click',(e)=>{
    const el = e.target
    
  if (el.closest('.botao-agendar')) {
    modalmed.style.display = 'block'
  }
  // Se clicou no botão de cancelar
  if (el.closest('.btn-back')) {
    modalmed.style.display = 'none'
  }
})
