let eventosGlobal = [];
/* ================================= */
/* OBTENER USUARIO DEL LOCALSTORAGE  */
/* ================================= */

const usuario = JSON.parse(localStorage.getItem("usuario"));

if(!usuario){
window.location.href="login.html";
}


/* ================================= */
/* MOSTRAR NOMBRE DEL USUARIO        */
/* ================================= */

document.getElementById("bienvenida").innerText =
"Bienvenido " + usuario.usuario;


/* ================================= */
/* CERRAR SESIÓN                     */
/* ================================= */

function cerrarSesion(){

localStorage.removeItem("usuario");

window.location.href="login.html";

}


/* ================================= */
/* OBTENER INSCRIPCIONES DEL USUARIO */
/* ================================= */

async function obtenerInscripciones(){

try{

const respuesta = await fetch(
`http://127.0.0.1:8000/inscribe/usuario/${usuario.id_usuario}`
);

if(!respuesta.ok) return [];

const inscripciones = await respuesta.json();

return inscripciones;

}catch(error){

console.log("Error obteniendo inscripciones:", error);
return [];

}

}


/* ================================= */
/* CARGAR EVENTOS                    */
/* ================================= */

async function cargarEventos() {
    try {
        const respuestaEventos = await fetch("http://127.0.0.1:8000/eventos/");

        if(!respuestaEventos.ok){
            console.log("Error al traer eventos");
            return;
        }

        const eventos = await respuestaEventos.json();
        console.log("EVENTOS:", eventos);

        const resLugares = await fetch("http://127.0.0.1:8000/lugar/");
        const listaLugares = await resLugares.json();

        const inscripciones = await obtenerInscripciones();
        console.log("INSCRIPCIONES:", inscripciones);

        const eventosInscritos = inscripciones.map(i => i.id_evento);
        actualizarIndicadores(eventos, eventosInscritos);

        const contenedor = document.getElementById("listaEventos");

        const listaProcesada = [];

        eventos.forEach(evento => {

            const idEvento = evento.id || evento.id_evento;

            const inscrito = eventosInscritos.includes(idEvento);
            const lleno = (evento.inscritos || 0) >= evento.cupo_max;

            const datosLugar = listaLugares.find(
                l => Number(l.id) === Number(evento.id_lugar)
            );

            const nombreDelLugar = datosLugar ? datosLugar.nombre : "No asignado";

            listaProcesada.push({
                id: idEvento,
                nombre: evento.nombre,
                descripcion: evento.descripcion,
                fecha: evento.fecha,
                hora: evento.hora_inicio || evento.hora,
                modalidad: evento.modalidad,
                cupo_max: evento.cupo_max,
                inscritos: evento.inscritos || 0,
                ponente: evento.ponente || "No asignado",
                lugar: nombreDelLugar,

                // 🔥 CLAVE PARA EL BOTÓN
                inscrito: inscrito,
                lleno: lleno
            });
        });

        eventosGlobal = listaProcesada;
        contenedor.data = listaProcesada;

    } catch (error) {
        console.log("Error cargando eventos:", error);
    }
}

const buscador = document.getElementById("buscadorEventos");

buscador.addEventListener("buscar", (e) => {
    const texto = e.detail.toLowerCase();

    filtrarEventos(texto);
});

//FUNCION FILTRAR//
function filtrarEventos(texto){

    const filtrados = eventosGlobal.filter(evento =>
        evento.nombre.toLowerCase().includes(texto)
    );

    const contenedor = document.getElementById("listaEventos");
    contenedor.data = filtrados;
}

/* ================================= */
/* INSCRIBIRSE A EVENTO              */
/* ================================= */

async function inscribirse(id_evento){

try{

const respuesta = await fetch("http://127.0.0.1:8000/inscribe/",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
id_usuario: Number(usuario.id_usuario),
id_evento: Number(id_evento),
fecha: new Date().toISOString().split("T")[0],
estado: "Inscrito"
})

});

const data = await respuesta.json();

const boton = document.getElementById("btn-" + id_evento);

if(!respuesta.ok){

alert(data.detail);

return;

}

alert("Inscripción realizada correctamente");

boton.innerText = "Cancelar inscripción";
boton.onclick = function(){
cancelarInscripcion(id_evento);
};

}catch(error){

console.log("Error al inscribirse:", error);

}

}


/* ================================= */
/* CANCELAR INSCRIPCIÓN              */
/* ================================= */

async function cancelarInscripcion(id_evento){

try{

const respuesta = await fetch(
`http://127.0.0.1:8000/inscribe/${usuario.id_usuario}/${id_evento}`,
{
method:"DELETE"
}
);

const boton = document.getElementById("btn-" + id_evento);

if(!respuesta.ok){

alert("Error al cancelar inscripción");
return;

}

alert("Inscripción cancelada");

boton.innerText = "Inscribirme";
boton.onclick = function(){
inscribirse(id_evento);
};

}catch(error){

console.log("Error cancelando inscripción:", error);

}

}


/* ================================= */
/* EJECUTAR AL CARGAR LA PAGINA      */
/* ================================= */

cargarEventos();

/* ================================= */
/* ACTUALIZAR INDICADORES            */
/* ================================= */

function actualizarIndicadores(eventos, eventosInscritos){

const total = eventos.length;

const mis = eventosInscritos.length;

const hoy = new Date().toISOString().split("T")[0];

const proximos = eventos.filter(e => e.fecha >= hoy).length;

document.getElementById("totalEventos").innerText = total;

document.getElementById("misInscripciones").innerText = mis;

document.getElementById("proximosEventos").innerText = proximos;

}
function mostrarTodosEventos() {

    // 1. limpiar buscador de forma segura
    const componente = document.getElementById("buscadorEventos");

    const input = componente?.querySelector("input");

    if (input) {
        input.value = "";
    }

    // 2. restaurar lista
    const contenedor = document.getElementById("listaEventos");

    if (Array.isArray(eventosGlobal) && eventosGlobal.length > 0) {
        contenedor.data = eventosGlobal;
    }
}

