//Collecting all the required DOM elements
const toggle = document.getElementById('toggle');
const close = document.getElementById('close');
const open = document.getElementById('open');
const modal = document.getElementById('modal');


//Event Listeners:

//To toggle the hamburger nav bar
toggle.addEventListener('click',()=>{
    document.body.classList.toggle('show-nav');
});

//To show modal
open.addEventListener('click', ()=>{
    modal.classList.add('show-modal');
});

//To close the modal
close.addEventListener('click',()=>{
    modal.classList.remove('show-modal')
});

//To hide modal on clicking outside the form
window.addEventListener('click',e=>e.target == modal ? modal.classList.remove('show-modal'): false);