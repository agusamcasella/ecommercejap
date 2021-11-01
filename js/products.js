const ORDENAR_POR_NOMBRE = "AZ"
const ORDENAR_POR_ASC_PRECIO = "PRECIOASC"
const ORDENAR_POR_DES_PRECIO = "PRECIODES"
const ORDENAR_POR_DES_RELEVANCIA = "RELEVANCIA"
var minPrecio = undefined;
var maxPrecio = undefined;
var productosArray = [];
var palabra = undefined;

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
function quitarTildes(str){
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function mostrarXBusqueda(nombre,descripcion){
    let nombr = nombre.toLowerCase();
    let descr = descripcion.toLowerCase();
    nombr = quitarTildes(nombr);
    descr = quitarTildes(descr);
    if(palabra == undefined || palabra == ""){
        return true;
    }else if((nombr.indexOf(palabra.toLowerCase())!=-1)||(descr.indexOf(palabra.toLowerCase())!=-1)){
        return true;
    }else{
        return false;
    }

}

function mostrarProductosLista() {

    let htmlContentToAppend = "";
    for (let i = 0; i < productosArray.length; i++) {
        let producto = productosArray[i];
        let nombre = producto.name;
        let descripcion = producto.description;
        
        if (((minPrecio == undefined) || (minPrecio != undefined && parseInt(producto.cost) >= minPrecio)) &&
            ((maxPrecio == undefined) || (maxPrecio != undefined && parseInt(producto.cost) <= maxPrecio))) {
            if (mostrarXBusqueda(nombre,descripcion)) {
                htmlContentToAppend += `
        
            <div class="card col-md-4 shadow-sm">
                <img width="100%" src="` + producto.imgSrc + `" alt="` + producto.description + `>
                <div class="card-body">
                    <p class="card-text">
                    <a href="product-info.html"><h4 class="mb-1">`+ producto.name + `</h4></a>
                        <small class="text-muted">` + convertirMoneda(producto.currency) + ` ` + producto.cost + ` </small>
                    </p>
                    <p class="card-text">` + producto.description + `</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">` + producto.soldCount + ` vendidos </small>

                    </div>
                </div>
            </div>
        
        `
            }
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

    document.getElementById("busqueda").addEventListener("keyup", function () {
        palabra = document.getElementById("busqueda").value;
        mostrarProductosLista();
    });
    document.getElementById("busqueda").addEventListener("focusout",function(){
        palabra = document.getElementById("busqueda").value;
        if(palabra == ""){
            mostrarProductosLista();
        }
    });
});
