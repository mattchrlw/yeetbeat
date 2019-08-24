function changeView(id) {
    document.querySelector('.active').classList.remove('active');
    document.querySelector('#' + id).classList.add('active');    
}