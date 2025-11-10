const menu = document.querySelector('.menu-mobile')
const navMenu = document.querySelector('.menu')

menu.addEventListener('click',(e)=>{
    const el = e.target
    
  const aberto = navMenu.dataset.open === 'true';
  navMenu.dataset.open = aberto ? 'false' : 'true';
})