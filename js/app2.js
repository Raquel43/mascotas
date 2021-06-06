


const admin = document.querySelector("#admin");
const divLista = document.querySelector("#tarjetas");
const divPaginacion = document.getElementById("paginacion");
const informacion = document.getElementById("info");
const mostrarMapa = document.getElementById("localizacion");
const botonEnviar = document.getElementById("enviar");
const formulario = document.getElementById("contactForm");
let perroSeleccionado = document.getElementById("perro");
let gatoSeleccionado = document.getElementById("gato");
let otroSeleccionado = document.getElementById("otro");

let paginaActual = 1;
let filas = 8;
let i = 0;
let itemsTotales = [];
let usuariosTotales = [];
let nuevoUsuario = [];

async function init() {
 await cargarMascotaAsync();
  //await cargarUsuarioAsync();

  mostrasLista(filas, paginaActual);
  crearBarraPaginacion(filas);
  admin.addEventListener("click", Admin);
  informacion.addEventListener("click", informacionUsuario);
  mostrarMapa.addEventListener("click", mapa);
  botonEnviar.addEventListener("click", insertarFormulario);
 perroSeleccionado.addEventListener("click", mostraPerros);
 gatoSeleccionado.addEventListener("click", mostraGatos);
 otroSeleccionado.addEventListener("click", mostraOtros);
}

init();

async function cargarMascotaAsync() {
  await fetch("./data/mascotas.json")
    .then((result) => result.json())
    .then((data) => {
      itemsTotales = data;
     });
}

// Mostrar lista de botones
function mostrasLista(filasPorPagina, pagina) {
  // Inicializar contenedor
  divLista.innerHTML = "";
  // Calculamos los items de la pagina
  let inicial = filasPorPagina * (pagina - 1); // restamos uno porque los array comienza por 0
  let final = inicial + filasPorPagina;
  // Sublista con los items de la página
  let itemsPagina = itemsTotales.slice(inicial, final);

  console.log(itemsPagina);

  // Recorremos el bucle de los items a mostrar
  itemsPagina.forEach((mascota, index) => {
    //console.log(mascota);
    divLista.innerHTML += `
      <div id="${index + 1}" class="tarjeta mb-4" style="width: 20rem;">
      <img class="p-2" src="img/${
        mascota.imagen
      }" class="card-img-top" alt="...">
      <div class="cuerpo-tarjeta">
        <h5 class="card-title">${mascota.titulo}</h5>
        <p class="card-text">${mascota.descripcion}</p>
        <a href="#" class="btn btn-primary">Adóptame</a>
      </div>
    </div> `;
  });
}




// Crear barrar de paginación
function crearBarraPaginacion(filasPorPagina) {
  divPaginacion.innerHTML = "";

  // Cálculo de páginas a mostrar
  let contadorPaginas = Math.ceil(itemsTotales.length / filasPorPagina);
  // Creación de un botón por página
  for (let i = 1; i <= contadorPaginas; i++) {
    // Por cada página creamos un botón
    let btn = crearBotonPaginacion(i);
    divPaginacion.appendChild(btn);
  }
}

// Crear el objeto botón con la acción a ejecutar
function crearBotonPaginacion(pagina) {
  // Creación elemento HTML botón
  let button = document.createElement("button");
  button.innerText = pagina;
  // Mostramos el botón activado si coincide con la página actual
  if (paginaActual == pagina) button.classList.add("active");

  // Acción a ejecutar en el evento click del botón
  button.addEventListener("click", function () {
    paginaActual = pagina; // Actualizamos la página a ver
    mostrasLista(filas, paginaActual); // Mostar datos de la página

    // Desactivar botón activo actual
    let botonActual = document.querySelector(".pagenumbers button.active");
    botonActual.classList.remove("active");
    // Activar botón del click
    button.classList.add("active");
  });

  return button;
}

//async function cargarUsuarioAsync() {
  //await fetch(`${dominioAPI}/usuarios`)
    //.then((result) => result.json())
    //.then((data) => {
      //usuariosTotales = data;
    //});
//}

function mostrarAlert2() {
  Swal.fire({
    position: "center",
    icon: "error",
    title: "usuario no registrado o contraseña incorrecta",
    showConfirmButton: true,
    timer: 5000,
  });
}

function Admin() {
  let usuarios = usuariosTotales;
  Swal.fire({
    title: "Acceso",
    html: `<input type="text" id="login" class="swal2-input" placeholder="Usuario">
    <input type="password" id="password" class="swal2-input" placeholder="Contraseña">`,
    confirmButtonText: "Acceder al Panel",
    focusConfirm: false,
    preConfirm: () => {
      const login = Swal.getPopup().querySelector("#login").value;
      const password = Swal.getPopup().querySelector("#password").value;
      let usuario = usuarios.find((user) => user.nombre == login);
      if (!login || !password) {
        Swal.showValidationMessage(
          `Por favor, introduzca usuario y contraseña`
        );
      } else if (usuario && usuario.password == password) {
        nuevoUsuario.push(usuario);
        console.log(nuevoUsuario);
        saveUserInStorage();
        alert("validación correcta");

        window.location.assign("../mascotas-frontend/mascotas-form.html");
      } else {
        mostrarAlert2();
      }
    },
  });
}

function saveUserInStorage() {
  // Comprovar en primer lloc si l'objecte Storage es troba definit al motor del navegador
  if (typeof Storage == "undefined") {
    alert("sessionStorage no soportado por el navegador");
  } else {
    sessionStorage.setItem("user", JSON.stringify(nuevoUsuario));
  }

  console.log("Datos guardados correctamente");
  //entrar();
}

function informacionUsuario() {
  Swal.fire({
    position: "center",
    icon: "info",
    html: '<img src="img/perroGracioso.png">',
    title:
      "Si necesita más información, rellene el formulario de contacto o llame por télefono en horario de oficina, de lunes a viernes de 9 a 14 hrs",
    showConfirmButton: true,
  });
}

function mapa() {
  Swal.fire({
    position: "center",
    icon: "info",
    title: "Nos puedes encontrar aquí:",
    html: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3072.1471270365987!2d2.6786244153726355!3d39.6464032794621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1297eceb1a8fc1e3%3A0xc973c6495c361cc9!2sCam%C3%AD%20de%20Son%20Reus%2C%20Illes%20Balears!5e0!3m2!1ses!2ses!4v1622645159325!5m2!1ses!2ses" width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
    showConfirmButton: true,
  });
}

function letrasMaximas(){
  let nombre = document.getElementById("nombre").value;
  if(nombre.length > 30){
    alert("Nombre demasiado largo");
    return false;
  } else {
    return true;
  }
}



function checkFormulario() {
  let nombre = document.getElementById("nombre").value;
  let email = document.getElementById("email").value;
  let telefono = document.getElementById("telefono").value;
  let mensaje = document.getElementById("mensaje").value;
  //comprobar si algun campo esta vacio
  if (nombre == "" || email == "" || mensaje == "" || telefono == "") {
    mostrarAlertDatos();
    return false;
  } else {
    return true;
  }
}

function mostrarAlertDatos() {
  Swal.fire({
    position: "center",
    icon: "error",
    title: "Faltan datos obligatorios",
    showConfirmButton: true,
    timer: 5000,
  });
}

function validarTelefono() {
  let valor = document.getElementById("telefono").value;
  if (isNaN(valor) || valor.length < 9 || valor.length > 15) {
    mostrarAlertTel();
    return false;
  } else {
    return true;
  }
}

//Alerta que se muestra si el telefono es incorrecto
function mostrarAlertTel() {
  Swal.fire({
    position: "center",
    icon: "error",
    title: "Número de teléfono invalido",
    showConfirmButton: true,
    timer: 5000,
  });
}

function validarEmail(elemento) {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/

  if (!regex.test(elemento)) {
    mostrarAlertMail();
    return false;
  } else {
    return true;
  }
}

//La siguiente función muestra un alert si el email es incorrecto
function mostrarAlertMail() {
  Swal.fire({
    position: "center",
    icon: "error",
    title: "Email incorrecto",
    showConfirmButton: true,
    timer: 5000,
  });
}

function insertarFormulario() {
  let formularioData = {
    nombre: document.querySelector("#nombre").value,
    email: document.querySelector("#email").value,
    telefono: document.querySelector("#telefono").value,
    mensaje: document.querySelector("#mensaje").value,
  };
  if(checkFormulario() && letrasMaximas() && validarTelefono(email) && validarTelefono()){
try{
  fetch(`${dominioAPI}/formularios`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formularioData),
  });
  mostrarAlertFormulario();
  formulario.reset();

 } 
 catch(error){
  if(typeof Promise){
    alert("se ha producido un error");
  }
 }
}
}  

function mostrarAlertFormulario() {
  Swal.fire({
    position: "center",
    icon: "info",
    title: "Gracias por ponerse en contacto con nosotros, en breve le contestaremos!",
    showConfirmButton: true,
    timer: 5000,
  });
}

function mostraPerros(){
  let listaMascotas = itemsTotales;
  divLista.innerHTML="";
  listaMascotas.forEach(mascota=>{
    let tipo = mascota.tipo;
   if(tipo == "perro"){
  
    divLista.innerHTML += `
      <div class="tarjeta mb-4" style="width: 20rem;">
      <img class="p-2" src="img/${
        mascota.imagen
      }" class="card-img-top" alt="...">
      <div class="cuerpo-tarjeta">
        <h5 class="card-title">${mascota.titulo}</h5>
        <p class="card-text">${mascota.descripcion}</p>
        <a href="#" class="btn btn-primary">Adóptame</a>
      </div>
    </div> `;
   }
  })
}




function mostraGatos(){
  let listaMascotas = itemsTotales;
  divLista.innerHTML="";
  listaMascotas.forEach(mascota=>{
    let tipo = mascota.tipo;
   if(tipo == "gato"){
  
    divLista.innerHTML += `
      <div class="tarjeta mb-4" style="width: 20rem;">
      <img class="p-2" src="img/${
        mascota.imagen
      }" class="card-img-top" alt="...">
      <div class="cuerpo-tarjeta">
        <h5 class="card-title">${mascota.titulo}</h5>
        <p class="card-text">${mascota.descripcion}</p>
        <a href="#" class="btn btn-primary">Adóptame</a>
      </div>
    </div> `;
   }
  })
}

function mostraOtros(){
  let listaMascotas = itemsTotales;
  divLista.innerHTML="";
  listaMascotas.forEach(mascota=>{
    let tipo = mascota.tipo;
   if(tipo == "otros"){
  
    divLista.innerHTML += `
      <div class="tarjeta mb-4" style="width: 20rem;">
      <img class="p-2" src="img/${
        mascota.imagen
      }" class="card-img-top" alt="...">
      <div class="cuerpo-tarjeta">
        <h5 class="card-title">${mascota.titulo}</h5>
        <p class="card-text">${mascota.descripcion}</p>
        <a href="#" class="btn btn-primary">Adóptame</a>
      </div>
    </div> `;
   }
  })
}


const search = document.querySelector('#buscador');
search.addEventListener('keyup', displayMatches);


const Mascotas = [];
fetch(`./data/mascotas.json`)
    .then(mascotas =>mascotas.json())
    .then(data => Mascotas.push(...data));
console.log("que mascotas tengo?",Mascotas);

function findMatches(palabra,Mascotas) {
  return Mascotas.filter(masc => {
      const regex = new RegExp(palabra, 'gi');
     return masc.descripcion.match(regex);
  });
}
function displayMatches(e) {
  const matchedArray = findMatches(e.target.value, Mascotas);
  const html = matchedArray.map(masc => {
      return `
      <div class="tarjeta mb-4" style="width: 20rem;">
      <img class="p-2" src="img/${
        masc.imagen
      }" class="card-img-top" alt="...">
      <div class="cuerpo-tarjeta">
        <h5 class="card-title">${masc.titulo}</h5>
        <p class="card-text">${masc.descripcion}</p>
        <a href="#" class="btn btn-primary">Adóptame</a>
      </div>
    </div>
      
  `;
  }).join('');
  console.log(html);
  divLista.innerHTML = html;
}