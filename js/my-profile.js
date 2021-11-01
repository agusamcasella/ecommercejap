let usuario = {};


function rellenarForumlario() {
    if (localStorage.getItem("usuario") !== null) {
        let usuariostorage = JSON.parse(localStorage.getItem("usuario"));
        if (usuariostorage.email === localStorage.getItem("email")) {
            usuario = usuariostorage;
            document.getElementById("nombre").value = usuario.nombre;
            document.getElementById("apellido").value = usuario.apellido;
            document.getElementById("email").value = usuario.email;
            document.getElementById("edad").value = usuario.edad;
            document.getElementById("telefono").value = usuario.telefono;
        }
    }
}
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    document.getElementById("email").value = localStorage.getItem("email");

    rellenarForumlario();

    document.getElementById("formulario").addEventListener("submit", function (e) {
        e.preventDefault();

        let nombre = document.getElementById("nombre").value;
        let apellido = document.getElementById("apellido").value;
        let email = document.getElementById("email").value;
        let edad = document.getElementById("edad").value;
        let telefono = document.getElementById("telefono").value;

        usuario.nombre = nombre;
        usuario.apellido = apellido;
        usuario.email = email;
        usuario.edad = edad;
        usuario.telefono = telefono;

        //actualizo el mail de la sesion
        localStorage.setItem("email", email);

        localStorage.setItem("usuario", JSON.stringify(usuario));
        location.reload();
    });
});