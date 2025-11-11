const modal = document.querySelector('.modal')
const btnCheck = document.querySelector('.dependent-check')
const btnCancel = document.querySelector('.back')

document.addEventListener('click',(e)=>{
    const el = e.target

  if (el.closest('.dependent-check')) {
    modal.style.display = 'block'
  }
  // Se clicou no botão de cancelar
  if (el.closest('.back')) {
    modal.style.display = 'none'
  }
})
