const ORDENAR_POR_NOMBRE = "AZ"
const ORDENAR_POR_ASC_PRECIO = "PRECIOASC"
const ORDENAR_POR_DES_PRECIO = "PRECIODES"
const ORDENAR_POR_DES_RELEVANCIA = "RELEVANCIA"
var minPrecio = undefined;
var maxPrecio = undefined;
var productosArray = [];

function convertirMoneda(moneda) {
    if (moneda === "USD") {
        return "U$S";
    } else if (moneda === "UYU") {
        return "$U";
    }
}
function ordenarProductos(criterio, array) {
    let result = [];
    if (criterio === ORDENAR_POR_NOMBRE) {
        result = array.sort(function (a, b) {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });
    } else if (criterio === ORDENAR_POR_ASC_PRECIO) {
        result = array.sort(function (a, b) {
            if (a.cost < b.cost) { return -1; }
            if (a.cost > b.cost) { return 1; }
            return 0;
        });
    } else if (criterio === ORDENAR_POR_DES_PRECIO) {
        result = array.sort(function (a, b) {
            if (a.cost > b.cost) { return -1; }
            if (a.cost < b.cost) { return 1; }
            return 0;
        });
    } else if (criterio === ORDENAR_POR_DES_RELEVANCIA) {
        result = array.sort(function (a, b) {
            if (a.soldCount > b.soldCount) { return -1; }
            if (a.soldCount < b.soldCount) { return 1; }
            return 0;
        });
    }


    return result;
}

function mostrarProductosLista() {

    let htmlContentToAppend = "";
    for (let i = 0; i < productosArray.length; i++) {
        let producto = productosArray[i];

        if (((minPrecio == undefined) || (minPrecio != undefined && parseInt(producto.cost) >= minPrecio)) &&
        ((maxPrecio == undefined) || (maxPrecio != undefined && parseInt(producto.cost) <= maxPrecio))){

        htmlContentToAppend += `
        <a href="#" class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="` + producto.imgSrc + `" alt="` + producto.description + `" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">`+ producto.name + `</h4>
                        <small class="text-muted">` + convertirMoneda(producto.currency) + ` ` + producto.cost + ` </small>
                    </div>
                    <p class="mb-1">` + producto.description + `</p>
                    
                    <small class="text-muted">` + producto.soldCount + ` vendidos </small>
                </div>
            </div>
        </a>
        `
    }
        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }
}



function mostrarProductosListaOrdenada(criterio, productos) {
    criterioNuevo = criterio;

    if (productos != undefined) {
        productosArray = productos;
    }

    productosArray = ordenarProductos(criterioNuevo, productosArray);


    mostrarProductosLista();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productosArray = resultObj.data;

            mostrarProductosListaOrdenada(ORDENAR_POR_NOMBRE, productosArray);
        }
    });

    document.getElementById("ordXRelevancia").addEventListener("click", function () {
        mostrarProductosListaOrdenada(ORDENAR_POR_DES_RELEVANCIA);
    });
    document.getElementById("ordAscPrecio").addEventListener("click", function () {
        mostrarProductosListaOrdenada(ORDENAR_POR_ASC_PRECIO);
    });
    document.getElementById("ordDescPrecio").addEventListener("click", function () {
        mostrarProductosListaOrdenada(ORDENAR_POR_DES_PRECIO);
    });
    document.getElementById("limpiarFiltroPrecio").addEventListener("click", function () {
        document.getElementById("rangoFiltroPrecioMin").value = "";
        document.getElementById("rangoFiltroPrecioMax").value = "";

        minPrecio = undefined;
        maxPrecio = undefined;

        mostrarProductosLista();
    });
    document.getElementById("filtroPrecio").addEventListener("click", function () {
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minPrecio = document.getElementById("rangoFiltroPrecioMin").value;
        maxPrecio = document.getElementById("rangoFiltroPrecioMax").value;

        if ((minPrecio != undefined) && (minPrecio != "") && (parseInt(minPrecio)) >= 0) {
            minPrecio = parseInt(minPrecio);
        }
        else {
            minPrecio = undefined;
        }

        if ((maxPrecio != undefined) && (maxPrecio != "") && (parseInt(maxPrecio)) >= 0) {
            maxPrecio = parseInt(maxPrecio);
        }
        else {
            maxPrecio = undefined;
        }

        mostrarProductosLista();
    });
});
