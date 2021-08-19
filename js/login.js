//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    let boton = document.getElementById('submit');
    submit.addEventListener('click', function (evento) {
        evento.preventDefault();
        let email = document.getElementById('email').value;
        localStorage.setItem('email', email);
        
        localStorage.setItem('sesion',true);
        window.location.href = 'index.html';
        
       
    });
});