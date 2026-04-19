/* ================================= */
/* Espera a que cargue toda la página */
/* ================================= */

document.addEventListener("DOMContentLoaded", function(){


/* ================================= */
/* Función para ver los eventos */
/* ================================= */

window.verEventos = function(){

alert("Mostrando todos los eventos disponibles");

}


/* ================================= */
/* Función para crear un evento */
/* ================================= */

window.crearEvento = function(){

alert("Formulario para crear evento");

}


/* ================================= */
/* Función para registrarse */
/* ================================= */

window.registrarse = function(){

alert("Te has registrado en el evento");

}


/* ================================= */
/* Carrusel automático de logos */
/* ================================= */

/* Selecciona todos los logos del fondo */

const logos = document.querySelectorAll(".bg-logo");

/* Variable para controlar el logo actual */

let index = 0;


/* Función que cambia el logo */

function cambiarLogo(){

/* Quita la clase activa a todos */

logos.forEach(function(logo){

logo.classList.remove("active");

});

/* Activa el logo actual */

logos[index].classList.add("active");

/* Pasa al siguiente logo */

index++;

/* Si llega al final vuelve al primero */

if(index >= logos.length){

index = 0;

}

}


/* Cambia el logo cada 3 segundos */

if(logos.length > 0){

setInterval(cambiarLogo, 3000);

}


/* ================================= */
/* Animación al hacer click en menú */
/* ================================= */

/* Selecciona todos los elementos del menú */

const linksMenu = document.querySelectorAll("nav ul li");


linksMenu.forEach(function(link){

link.addEventListener("click", function(e){

/* Crea un elemento para la animación */

const circle = document.createElement("span");

/* Obtiene tamaño del botón */

const rect = this.getBoundingClientRect();

const size = Math.max(rect.width, rect.height);


/* Ajusta tamaño del círculo */

circle.style.width = size + "px";
circle.style.height = size + "px";


/* Posición donde se hace click */

circle.style.left = e.offsetX - size/2 + "px";
circle.style.top = e.offsetY - size/2 + "px";


/* Activa la animación */

circle.classList.add("ripple");

this.appendChild(circle);


/* Elimina la animación después */

setTimeout(function(){

circle.remove();

},600);

});

});

});


/* ================================= */
/* Función de inicio de sesión */
/* ================================= */

window.login = function(){

alert("Aquí iría el formulario de inicio de sesión");

}