const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";
const CART_DESAFIATE_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json"
var showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function (url) {
  var result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

function chequearsesion() {
  if (localStorage.getItem("email") === null) {
    if (!(location.pathname.endsWith('login.html'))) {
      alert("Debe iniciar sesion.");

      window.location.href = 'login.html';
    }
  } else {
    if (!(location.pathname.endsWith('login.html'))) {
      let htmlagregar = `
      <div class="dropdown">
          <button id="emailusuario" class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            `+ localStorage.getItem("email") +`
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" href="cart.html">Mi Carrito <i class="fas fa-shopping-cart"></i></a>
            <a class="dropdown-item" href="my-profile.html">Mi Perfil  <i class="fas fa-user-circle"></i></a>
            <div class="dropdown-divider"></div>
            <button id="salir" class="dropdown-item" >Salir  <i class="fas fa-sign-out-alt"></i></button>
          </div>
      </div>
      
    `
      document.getElementById("cabezal").innerHTML += htmlagregar;
    } else {
      alert("Ya hay un usuario logueado.");
      window.location.href = 'index.html';
    }
  }
}

function botonsalir() {
  localStorage.removeItem("email");
  window.location.href = "login.html";
}
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

  chequearsesion();

  if (!(location.pathname.endsWith('login.html'))) {
    document.getElementById("salir").addEventListener("click", function () {
      botonsalir();
    });
  }
});

