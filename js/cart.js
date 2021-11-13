let articulos = {};
let porcentajeenvio = 5;
function convertirMoneda(moneda) {
    if (moneda === "USD") {
        return "U$S";
    } else if (moneda === "UYU") {
        return "$";
    }
}

function quitarElemento(id) {
    articulos.splice(id, 1);
}

function quitarElementosTablaEscucha() {
    let botones = document.getElementsByName("botonesdequitar");
    for (let i = 0; i < botones.length; i++) {
        botones[i].addEventListener("click", function (e) {
            quitarElemento(i)
            rellenarTabla();
        })
    }
}

function rellenarTabla() {

    let htmlParaTabla = "";
    let i = 0;
    for (let articulo of articulos) {
        let img = articulo.src;
        let nombre = articulo.name;
        let costo = articulo.unitCost;
        let cantidad = articulo.count;
        let subtotal = costo * cantidad;

        htmlParaTabla += `
            <tr>
                <td><img src="`+ img + `" width="50px"></td>
                <td>`+ nombre + `</td>
                <td>`+ convertirMoneda(articulo.currency) + ` ` + costo + `</td>
                <td><input  name="cantidadA" min="0" type="number" style="width:60px" value="` + cantidad + `"></td>
                <td ><p style="width:100%" text-align="right">` + convertirMoneda(articulo.currency) + ` <span id=` + i + `> ` + subtotal.toFixed(2) + `</span><p></td>
                <td><input type="button" id="quitar${i}" name="botonesdequitar" value="x"></td>

            </tr>
             `;
        i++
    }
    document.getElementById("contenedorArticulos").innerHTML = htmlParaTabla;

    quitarElementosTablaEscucha();
    calcularSubtotalForm();
    calcularTotalyEnvio();
    //escucha inputs de cantidades para la tabla
    let cantidadesinput = document.getElementsByName("cantidadA");
    for (let i = 0; i < cantidadesinput.length; i++) {
        let cant = cantidadesinput[i];
        cant.addEventListener("change", function (e) {
            if (cant.value === "") {
                cant.value = 0;
            }
            calcularSubtotalTabla(i, cant.value);
            calcularSubtotalForm();
            calcularTotalyEnvio();
            validarTotal();

        })

    }

}


function calcularSubtotalTabla(id, cantidad) {
    let sub = parseInt(cantidad) * parseInt(articulos[id].unitCost);
    document.getElementById(`${id}`).innerHTML = sub.toFixed(2);
}


function calcularSubtotalForm() {
    let subform = 0;
    for (let i = 0; i < articulos.length; i++) {
        let asumar = 0;
        if (articulos[i].currency === "UYU") {
            asumar = parseInt(document.getElementById(`${i}`).innerHTML);
        } else if (articulos[i].currency === "USD") {
            asumar = (parseInt(document.getElementById(`${i}`).innerHTML) * 40);
        }
        subform += parseInt(asumar);
    }
    document.getElementById("subtotalform").innerHTML = subform.toFixed(2);
}


function calcularTotalyEnvio() {
    let total = 0;
    let envio = 0;
    let subtotalform = parseInt(document.getElementById("subtotalform").innerHTML);
    envio = (subtotalform * (porcentajeenvio / 100));
    total = parseInt(subtotalform) + parseInt(envio);
    document.getElementById("costoenvioform").innerHTML = envio.toFixed(2);
    document.getElementById("totalform").innerHTML = total.toFixed(2);
}

function agregarDetalleEnvio() {
    let detalle = "";
    if (porcentajeenvio == 5) {
        detalle = " - Standard";
    } else if (porcentajeenvio == 7) {
        detalle = " - Express";
    } else if (porcentajeenvio == 15) {
        detalle = " - Premium";
    }
    document.getElementById("tipoenvioform").innerHTML = detalle;
}

function rellenarModal(id) {

    if ("formapago1" === id) {
        document.getElementById("numerotarjeta").disabled = false;
        document.getElementById("codigotarjeta").disabled = false;
        document.getElementById("fechavencimiento").disabled = false;
        document.getElementById("numerocuenta").disabled = true;
        document.getElementById("numerocuenta").value = "";
        document.getElementById("errorNumCuenta").innerHTML = "";

        document.getElementById("formaPago").innerHTML = "Tarjeta de crèdito";

    } else if ("formapago2" === id) {
        document.getElementById("numerotarjeta").disabled = true;
        document.getElementById("codigotarjeta").disabled = true;
        document.getElementById("fechavencimiento").disabled = true;
        document.getElementById("numerotarjeta").value = "";
        document.getElementById("codigotarjeta").value = "";
        document.getElementById("fechavencimiento").value = "";
        document.getElementById("errorNumeroTarjeta").innerHTML = "";
        document.getElementById("errorCodigoTarjeta").innerHTML = "";
        document.getElementById("errorFecha").innerHTML = "";

        document.getElementById("numerocuenta").disabled = false;
        document.getElementById("formaPago").innerHTML = "Transferencia bancaria";
    }
}
function validarFormapago() {

    let valido = false;
    if (document.getElementById("formaPago").innerHTML === "No se ha seleccionado.") {
        document.getElementById("errorFormapago").innerHTML = "Debe seleccionar una forma de pago.";
        valido = false;
    } else {
        document.getElementById("errorFormapago").innerHTML = "";
        if (document.getElementById("formaPago").innerHTML === "Tarjeta de crèdito") {
            valido = validarTarjeta();
        } else if (document.getElementById("formaPago").innerHTML === "Transferencia bancaria") {
            valido = validarBancaria();
        }
    }
    return valido;
}
function validarBancaria() {
    let valido = false;
    if (document.getElementById("numerocuenta").value === "") {
        document.getElementById("errorNumCuenta").innerHTML = "Obligatorio.";
        document.getElementById("errorFormaDePagos").innerHTML = "Faltan Datos.";
        valido = false;

    } else {
        document.getElementById("errorNumCuenta").innerHTML = "";
        document.getElementById("errorFormaDePagos").innerHTML = "";

        valido = true;
    }
    return valido;
}
function validarTarjeta() {
    let valido = false;
    if (document.getElementById("numerotarjeta").value === "") {
        document.getElementById("errorNumeroTarjeta").innerHTML = "Obligatorio.";
        document.getElementById("errorFormaDePagos").innerHTML = "Faltan Datos.";
        valido = false;
    } else {
        document.getElementById("errorNumeroTarjeta").innerHTML = "";
        document.getElementById("errorFormaDePagos").innerHTML = "";

        valido = true;
    }
    if (document.getElementById("codigotarjeta").value === "") {
        document.getElementById("errorCodigoTarjeta").innerHTML = "Obligatorio.";
        document.getElementById("errorFormaDePagos").innerHTML = "Faltan Datos.";
        valido = false;
    } else {
        document.getElementById("errorCodigoTarjeta").innerHTML = "";
        document.getElementById("errorFormaDePagos").innerHTML = "";

        valido = true;
    }
    if (document.getElementById("fechavencimiento").value === "") {
        document.getElementById("errorFecha").innerHTML = "Obligatorio.";
        document.getElementById("errorFormaDePagos").innerHTML = "Faltan Datos.";
        valido = false;
    } else {
        document.getElementById("errorFecha").innerHTML = "";
        document.getElementById("errorFormaDePagos").innerHTML = "";

        valido = true;
    }
    return valido;
}
function validarTotal() {
    let valido = false;
    valido = (document.getElementById("totalform").innerHTML !== "0.00");
    if (!valido) {
        document.getElementById("errorTotal").innerHTML = "Debe comprar 1 item por lo menos.";
    } else {
        document.getElementById("errorTotal").innerHTML = "";
    }
    return valido;
}
function validarCamposFormulario() {
    let validocalle = false;
    let validonumero = false;
    let validoesquina = false;
    let formapagoval = false;
    let validarcantTotal = false;
    if (document.getElementById("calle").value === "") {
        document.getElementById("errorCalle").innerHTML = "Obligatorio.";
    } else {
        document.getElementById("errorCalle").innerHTML = "";
        validocalle = true;
    }
    if (document.getElementById("numero").value === "") {
        document.getElementById("errorNumero").innerHTML = "Obligatorio.";
    } else {
        document.getElementById("errorNumero").innerHTML = "";
        validonumero = true;
    }
    if (document.getElementById("esquina").value === "") {
        document.getElementById("errorEsquina").innerHTML = "Obligatorio.";
    } else {
        document.getElementById("errorEsquina").innerHTML = "";
        validoesquina = true;
    }
    formapagoval = validarFormapago();
    validarcantTotal = validarTotal();

    return (validocalle * validoesquina * validonumero * formapagoval * validarcantTotal);
}
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

    getJSONData(CART_DESAFIATE_URL).then(function (resultObj) {

        if (resultObj.status === "ok") {
            articulos = resultObj.data.articles;
            console.log(articulos);
            rellenarTabla();
            calcularSubtotalForm();
            calcularTotalyEnvio();

            let tiposenvioradios = document.getElementsByName("tipoenvio");


            for (let i = 0; i < tiposenvioradios.length; i++) {
                let tipoenvio = tiposenvioradios[i];
                tipoenvio.addEventListener("click", function (e) {
                    porcentajeenvio = tipoenvio.value;

                    agregarDetalleEnvio();
                    calcularTotalyEnvio();
                })
            }


        }
    });
    document.getElementById("numerotarjeta").disabled = true;
    document.getElementById("codigotarjeta").disabled = true;
    document.getElementById("fechavencimiento").disabled = true;

    document.getElementById("numerocuenta").disabled = true;
    let radiodepagos = document.getElementsByName("formapagomodal");
    for (let i = 0; i < radiodepagos.length; i++) {
        radiodepagos[i].addEventListener("click", function (e) {
            rellenarModal(radiodepagos[i].value);

        });
    }
    document.getElementById("close").addEventListener("click", function (e) {
        validarFormapago();
    })
    document.getElementById("formulario").addEventListener("submit", function (e) {
        //e.preventDefault();
        let val = validarCamposFormulario();
        if (!val) {
            e.preventDefault();
        }

    })
});