const burger = document.querySelector('.burger'),
      menu = document.querySelector('.menu'),
      closeElem = document.querySelector('.menu__close'),
      overlay = document.querySelector('.menu__overlay');

burger.addEventListener('click', () => {
    menu.classList.add('active');
});

closeElem.addEventListener('click', () => {
    menu.classList.remove('active');
});

overlay.addEventListener('click', () => {
    menu.classList.remove('active');
});

const percent = document.querySelectorAll('.progress__percent'),
      lines = document.querySelectorAll('.progress__scale-fill');

percent.forEach( (item, i) => {
    lines[i].style.width = item.innerHTML;
});