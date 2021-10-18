var producto = {};
var productosRel = {};
var productoCommentarios = {};
const ORDENAR_POR_FECHA = "xFecha";

function ordenarComentarios(criterio, array) {
    let result = [];
    if (criterio === ORDENAR_POR_FECHA) {
        result = array.sort(function (a, b) {
            let adate = new Date(a.dateTime);
            let bdate = new Date(b.dateTime);

            if (adate > bdate) { return -1; }
            if (adate < bdate) { return 1; }
            return 0;
        });
    }
    return result;
}


function convertirMoneda(moneda) {
    if (moneda === "USD") {
        return "U$S";
    } else if (moneda === "UYU") {
        return "$U";
    }
}
function mostrarImagenes(array) {
    let htmlagregarItems = "";
    let htmlagregarol = "";

    for (let i = 0; i < array.length; i++) {
        let imagen = array[i];
        let active = "";
        if(i==0){
            active = "active";
        }
        
        htmlagregarItems += `
        <div class="carousel-item `+active+`">
                <img src="`+ imagen +`" class="d-block w-100" alt="...">
        </div>
        `
        htmlagregarol +=`
        <li data-target="#productImagesGallery" data-slide-to="`+i+`" class="`+active+`"></li>
        `
        document.getElementById("productImagesGalleryol").innerHTML = htmlagregarol;

        document.getElementById("productImagesGalleryitems").innerHTML = htmlagregarItems;
    }
};



function mostrarComentariosProducto() {

    let htmlagregar = "";

    for (let comentario of productoCommentarios) {
        let htmlestrellas = "";
        for (let i = 0; i < comentario.score; i++) {
            htmlestrellas += `<span class="fa fa-star checked"></span>`;
        };
        for (let i = 5; i > comentario.score; i--) {
            htmlestrellas += `<span class="fa fa-star "></span>`;
        };
        htmlagregar += `
                <div class="list-group-item list-group-item-action">
                    <div class="row">
                        <small>` + comentario.user + ` </small>
                    </div>
                    <div class="row">
                        <small>` + comentario.description + ` </small>
                    </div>
                    <div class="row">
                        <small>` + htmlestrellas + ` </small>
                    </div>
                    <small> ` + comentario.dateTime + `</small>
                </div>
                    `

        document.getElementById("contenedorComentarios").innerHTML = htmlagregar;
    }

};

function mostraryOrdenarXFechaComentarios(comentarios) {

    productoCommentarios = ordenarComentarios(ORDENAR_POR_FECHA, comentarios);
    mostrarComentariosProducto();

};

function agregarNuevoComentario(usuario, puntaje, mensaje) {
    if (mensaje != null) {
        let htmlagregar = "";
        let fecha = new Date();

        let htmlestrellas = "";
        for (let i = 0; i < puntaje; i++) {
            htmlestrellas += `<span class="fa fa-star checked"></span>`;
        };
        for (let i = 5; i > puntaje; i--) {
            htmlestrellas += `<span class="fa fa-star "></span>`;
        };
        htmlagregar += `
                <div class="list-group-item list-group-item-action">
                    <div class="row">
                        <small>` + usuario + ` </small>
                    </div>
                    <div class="row">
                        <small>` + mensaje + ` </small>
                    </div>
                    <div class="row">
                        <small>` + htmlestrellas + ` </small>
                    </div>
                    <small> ` + fecha.toLocaleString() + `</small>
                </div>
                    `

        let htmlviejo = document.getElementById("contenedorComentarios").innerHTML;
        document.getElementById("contenedorComentarios").innerHTML = htmlagregar + htmlviejo;
    }
}

function mostrarProductosRel() {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productosRel = resultObj.data;
            
            let htmlProdRelacionado = "";
            for (let productorelacionado of producto.relatedProducts) {
                let infoRelacionado = productosRel[productorelacionado];
                let nombre = infoRelacionado.name;
                let imagensrc = infoRelacionado.imgSrc;
                let precio = convertirMoneda(infoRelacionado.currency) + " " + infoRelacionado.cost;


                htmlProdRelacionado += `
                <div class="col-lg-3 col-md-2 col-3">
                
                    <figure class="figure">
                        <a href="product-info.html">
                            <img src=`+ imagensrc +` class="figure-img img-fluid rounded">
                            <figcaption class="figure-caption">`+ nombre + ` - ` + precio +`</figcaption>
                        </a>
                    </figure>
                  
                </div>
                `


                document.getElementById("contenedorProdRelacionado").innerHTML = htmlProdRelacionado;
            }
            
            
            

        }
    });



}
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    document.getElementById("usuario").value = localStorage.getItem("email");
    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {

        if (resultObj.status === "ok") {
            producto = resultObj.data;
           
            let nombreProducto = document.getElementById("nombreProducto");
            let descripcionProducto = document.getElementById("descripcionProducto");
            let precioProducto = document.getElementById("precioProducto");
            let cantidadVendidos = document.getElementById("cantProductosVendidos");
            let categoriaProd = document.getElementById("categoriaProd");

            nombreProducto.innerHTML = producto.name;
            descripcionProducto.innerHTML = producto.description;
            precioProducto.innerHTML = convertirMoneda(producto.currency) + " " + producto.cost;
            cantidadVendidos.innerHTML = producto.soldCount;
            categoriaProd.innerHTML = producto.category;
            
            //Muestro las imagenes en forma de galería
            mostrarImagenes(producto.images);

            //muestro comentarios ordenados
            getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
                if (resultObj.status === "ok") {
                    productoCommentarios = resultObj.data;
                    mostraryOrdenarXFechaComentarios(productoCommentarios);
                   
                    
                    let urlParams = new URLSearchParams(window.location.search);
                    let usuario = urlParams.get("usuario");
                    let estrellas = urlParams.get('estrellas');
                    let mensaje = urlParams.get('comentario');
                    //si hay un comentario para agregar en la url se lo agrega
                    agregarNuevoComentario(usuario, estrellas, mensaje);

                }
            });

            //Muesro productos relacionados
            mostrarProductosRel();

        }
    });



});