function chequearFormulario() {
    let pass = document.getElementById('pass').value;
    let email = document.getElementById('email').value;
    let msjemail = document.getElementById('msjemail');
    let msjpass = document.getElementById('msjpass');
    
    if (email === "" || pass === "") {
        if (email === "") {
            msjemail.innerHTML = "**Campo Vacìo.";
        } else {
            msjemail.innerHTML = " ";
        }
        
        if (pass === "") {
            msjpass.innerHTML = "**Campo Vacìo.";
        } else {
            msjpass.innerHTML = " ";
        }

        return false;

    } else {
        return true;
    }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    let formulario = document.getElementById('formulario');
    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();

        if (chequearFormulario()) {
            let email = document.getElementById('email').value;
            localStorage.setItem('email', email);
            
            window.location.href = 'index.html';
        }

    });
});