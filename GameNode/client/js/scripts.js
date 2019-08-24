function changeView(id) {
    const old = document.querySelector('.active');
    const next = document.querySelector('#' + id);

    next.classList.add('active');
    next.style.animation = 'fadeIn 0.2s ease forwards';

    old.style.animation = 'fadeOut 0.2s ease forwards';
    old.classList.remove('active');
}