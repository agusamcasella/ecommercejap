let usuario = {};

function guardarImagen() {
    var imgusr = document.getElementById("imgpreview");
    // Take action when the image has loaded
    
        var imgCanvas = document.createElement("canvas"),
            imgContext = imgCanvas.getContext("2d");
        // Make sure canvas is as big as the picture
        imgCanvas.width = imgusr.width;
        imgCanvas.height = imgusr.height;
        // Draw image into canvas element
        imgContext.drawImage(imgusr, 0, 0, imgusr.width, imgusr.height);
        // Get canvas contents as a data URL
        var imgAsDataURL = imgCanvas.toDataURL("image/png");
        // Save image into localStorage
            localStorage.setItem("imgusr", imgAsDataURL);

}
        
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
                    document.getElementById("imgpreview").src = localStorage.getItem("imgusr");
                }
            }
        }
        //Función que se ejecuta una vez que se haya lanzado el evento de
        //que el documento se encuentra cargado, es decir, se encuentran todos los
        //elementos HTML presentes.
        document.addEventListener("DOMContentLoaded", function (e) {
            document.getElementById("email").value = localStorage.getItem("email");

            rellenarForumlario();
            document.getElementById("img").addEventListener("change",function(e){
                if(document.getElementById("img").files.length > 0){
                    let src = URL.createObjectURL(document.getElementById("img").files[0]);
                    imgusr = document.getElementById("imgpreview");
                    imgusr.src = src;
                    imgusr.style.width = "150px";
                    imgusr.style.display ="block";
                }
            })

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
                
                guardarImagen();
                //actualizo el mail de la sesion
                localStorage.setItem("email", email);

                localStorage.setItem("usuario", JSON.stringify(usuario));
                location.reload();
            });
        });