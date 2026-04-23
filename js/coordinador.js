const BASE_URL = "https://backend-eventos-rth3.onrender.com";
let eventosGlobal = [];

/* ================================= */
/* OBTENER USUARIO DEL LOCALSTORAGE  */
/* ================================= */

const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
    window.location.href = "login.html";
}

/* ================================= */
/* MOSTRAR NOMBRE DEL USUARIO        */
/* ================================= */

document.getElementById("bienvenida").innerText =
    "Bienvenido " + usuario.usuario;

/* ================================= */
/* CERRAR SESIÓN                     */
/* ================================= */

function cerrarSesion() {
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
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

        const resLugares = await fetch(`${BASE_URL}/lugar/`);
        const listaLugares = await resLugares.json();

        const contenedor = document.getElementById("listaEventos");
        const listaProcesada = [];

        eventos.forEach(evento => {

            const idEvento = evento.id || evento.id_evento;

            const datosLugar = listaLugares.find(
                l => Number(l.id) === Number(evento.id_lugar)
            );

            const nombreDelLugar = datosLugar ? datosLugar.nombre : "No asignado";

            let estadoVisible = evento.estado || "Sin estado";

            // ❌ NO mostrar cancelados
            if ((estadoVisible || "").toLowerCase() === "cancelado") {
                return;
            }

            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            const fechaEvento = new Date(evento.fecha);
            fechaEvento.setHours(0, 0, 0, 0);

            // ❌ NO mostrar eventos pasados
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
                lugar: nombreDelLugar
            });
        });

        eventosGlobal = listaProcesada;
        contenedor.data = listaProcesada;

        actualizarIndicadores(listaProcesada);

    } catch (error) {
        console.log("Error cargando eventos:", error);
    }
}

/* ================================= */
/* BUSCADOR                          */
/* ================================= */

const buscador = document.getElementById("buscadorEventos");

buscador.addEventListener("buscar", (e) => {
    const texto = e.detail.toLowerCase();
    filtrarEventos(texto);
});

function filtrarEventos(texto) {
    const filtrados = eventosGlobal.filter(evento =>
        evento.nombre.toLowerCase().includes(texto)
    );

    document.getElementById("listaEventos").data = filtrados;
}

/* ================================= */
/* INDICADORES                       */
/* ================================= */

function actualizarIndicadores(eventos) {
    const total = eventos.length;

    const activos = eventos.filter(e =>
        (e.estado || "").toLowerCase() === "programado" ||
        (e.estado || "").toLowerCase() === "en curso"
    ).length;

    const hoy = new Date().toISOString().split("T")[0];

    const proximos = eventos.filter(e => e.fecha >= hoy).length;

    document.getElementById("totalEventos").innerText = total;
    document.getElementById("eventosActivos").innerText = activos;
    document.getElementById("proximosEventos").innerText = proximos;
}

/* ================================= */
/* MOSTRAR TODOS                     */
/* ================================= */

function mostrarTodosEventos() {
    const componente = document.getElementById("buscadorEventos");
    const input = componente?.querySelector("input");

    if (input) {
        input.value = "";
    }

    if (Array.isArray(eventosGlobal)) {
        document.getElementById("listaEventos").data = eventosGlobal;
    }
}

/* ================================= */
/* ALERTAS                           */
/* ================================= */

function mostrarAlerta(mensaje, tipo = "exito") {
    const contenedor = document.getElementById("alerta-container");
    if (!contenedor) return;

    const alerta = document.createElement("app-alerta");
    alerta.setAttribute("mensaje", mensaje);
    alerta.setAttribute("tipo", tipo);

    contenedor.appendChild(alerta);
}

/* ================================= */
/* INICIO                            */
/* ================================= */

cargarEventos();