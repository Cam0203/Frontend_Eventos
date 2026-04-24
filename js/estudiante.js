const BASE_URL = "https://backend-eventos-rth3.onrender.com";
let eventosGlobal = [];
/* ================================= */
/* OBTENER USUARIO DEL LOCALSTORAGE  */
/* ================================= */

const usuario = JSON.parse(sessionStorage.getItem("usuario"));

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

const respuesta = await fetch(`${BASE_URL}/inscribe/usuario/${usuario.id_usuario}`);

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
        const respuestaEventos = await fetch(`${BASE_URL}/eventos/`);
        if (!respuestaEventos.ok) {
            console.log("Error al traer eventos");
            return;
        }

        const eventos = await respuestaEventos.json();
        console.log("EVENTOS:", eventos);

        const resLugares = await fetch(`${BASE_URL}/lugar/`);
        const listaLugares = await resLugares.json();

        const inscripciones = await obtenerInscripciones();
        console.log("INSCRIPCIONES:", inscripciones);

        const eventosInscritos = inscripciones.map(i => i.id_evento);

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

            let estadoVisible = evento.estado || "Sin estado";

            // no mostrar cancelados
            if ((estadoVisible || "").toLowerCase() === "cancelado") {
                return;
            }

            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            const fechaEvento = new Date(evento.fecha);
            fechaEvento.setHours(0, 0, 0, 0);

            // no mostrar eventos con fecha pasada
            if (fechaEvento < hoy) {
                return;
            }

            estadoVisible = evento.estado || "Programado";

            listaProcesada.push({
                id: idEvento,
                nombre: evento.nombre,
                descripcion: evento.descripcion,
                fecha: evento.fecha,
                hora: evento.hora_inicio || evento.hora,
                modalidad: evento.modalidad,
                estado: estadoVisible,
                cupo_max: evento.cupo_max,
                inscritos: evento.inscritos || 0,
                ponente: evento.primer_nombre
                    ? `${evento.primer_nombre} ${evento.primer_apellido ?? ""}`.trim()
                    : (evento.ponente || "No asignado"),
                lugar: nombreDelLugar,
                inscrito: inscrito,
                lleno: lleno
            });
        });

        eventosGlobal = listaProcesada;
        contenedor.data = listaProcesada;
        actualizarIndicadores(listaProcesada, eventosInscritos);

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

async function inscribirse(id_evento) {
    try {
        const respuesta = await fetch(`${BASE_URL}/inscribe/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_usuario: Number(usuario.id_usuario),
                id_evento: Number(id_evento),
                fecha: new Date().toISOString().split("T")[0],
                estado: "Inscrito"
            })
        });

        let data = {};
        try {
            data = await respuesta.json();
        } catch (e) {
            data = {};
        }

        const boton = document.getElementById("btn-" + id_evento);

        if (!respuesta.ok) {
            mostrarAlerta(data.detail || "No se pudo realizar la inscripción", "error");
            return;
        }

        mostrarAlerta("Inscripción realizada correctamente", "exito");

        if (boton) {
            boton.innerText = "Cancelar inscripción";
            boton.onclick = function () {
                cancelarInscripcion(id_evento);
            };
        }

        await enviarNotificacionCorreo(
        "andreasaenz0203@gmail.com",
        "Nueva inscripción - Sistema Eventos CUL",
        `El estudiante ${usuario.usuario} se inscribió al evento con ID ${id_evento}.`
    );

    } catch (error) {
        console.log("Error al inscribirse:", error);
        mostrarAlerta("Error al conectar con el servidor", "error");
    }
}


/* ================================= */
/* CANCELAR INSCRIPCIÓN              */
/* ================================= */

async function cancelarInscripcion(id_evento){

try{

const respuesta = await fetch(`${BASE_URL}/inscribe/${usuario.id_usuario}/${id_evento}`,
{
method:"DELETE"
}
);

const boton = document.getElementById("btn-" + id_evento);

if (!respuesta.ok) {
    mostrarAlerta("Error al cancelar inscripción", "error");
    return;
}

mostrarAlerta("Inscripción cancelada", "exito");

boton.innerText = "Inscribirme";
boton.onclick = function(){
inscribirse(id_evento);
};

}catch(error){

console.log("Error cancelando inscripción:", error);

}

}


cargarEventos();

/* ================================= */
/* ACTUALIZAR INDICADORES            */
/* ================================= */

function actualizarIndicadores(eventos, eventosInscritos) {
    const total = eventos.length;
    const mis = eventos.filter(e => eventosInscritos.includes(e.id)).length;

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

function mostrarAlerta(mensaje, tipo = "exito") {
    const contenedor = document.getElementById("alerta-container");
    if (!contenedor) return;

    const alerta = document.createElement("app-alerta");
    alerta.setAttribute("mensaje", mensaje);
    alerta.setAttribute("tipo", tipo);

    contenedor.appendChild(alerta);
}