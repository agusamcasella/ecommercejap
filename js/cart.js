let articulos = {};
let porcentajeenvio = 5;
function convertirMoneda(moneda) {
    if (moneda === "USD") {
        return "U$S";
    } else if (moneda === "UYU") {
        return "$";
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
            </tr>
             `;
        i++
    }
    document.getElementById("contenedorArticulos").innerHTML = htmlParaTabla;

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

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(CART_DESAFIATE_URL).then(function (resultObj) {

        if (resultObj.status === "ok") {
            articulos = resultObj.data.articles;
            rellenarTabla();
            calcularSubtotalForm();
            calcularTotalyEnvio();
            let tiposenvioradios = document.getElementsByName("tipoenvio");
            let tipoenvioform = document.getElementById("tipoenvioform");

            for (let i = 0; i < tiposenvioradios.length; i++) {
                let tipoenvio = tiposenvioradios[i];
                tipoenvio.addEventListener("click", function (e) {
                    porcentajeenvio = tipoenvio.value;

                    let detalle = "";
                    if (porcentajeenvio == 5) {
                        detalle = " - Standard";
                    } else if (porcentajeenvio == 7) {
                        detalle = " - Express";
                    } else if (porcentajeenvio == 15) {
                        detalle = " - Premium";
                    }
                    tipoenvioform.innerHTML = detalle;
                    calcularTotalyEnvio();
                })
            }

            let cantidadesinput = document.getElementsByName("cantidadA");
            for (let i = 0; i < cantidadesinput.length; i++) {
                let cant = cantidadesinput[i];
                cant.addEventListener("change", function (e) {
                    calcularSubtotalTabla(i, cant.value);
                    calcularSubtotalForm();
                    calcularTotalyEnvio();
                })
            }
        }
    });


});