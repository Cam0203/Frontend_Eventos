const BASE_URL = "https://backend-eventos-rth3.onrender.com";
const API_INSCRIBE = `${BASE_URL}/inscribe`;
const API_ASISTENCIA = `${BASE_URL}/asistencia`;
let eventosGlobal = [];

/* ================================= */
/* OBTENER USUARIO DEL sessionStorage  */
/* ================================= */

const usuario = JSON.parse(sessionStorage.getItem("usuario"));

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
    sessionStorage.removeItem("usuario");
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

async function verInscritos(id_evento, nombreEvento, fechaEvento) {
    try {
        const res = await fetch(`${API_INSCRIBE}/evento/${id_evento}`);
        if (!res.ok) throw new Error("No se pudieron cargar los inscritos");

        const inscritos = await res.json();

        const resAsistencia = await fetch(`${API_ASISTENCIA}/evento/${id_evento}`);
        const asistenciaData = resAsistencia.ok ? await resAsistencia.json() : [];

        const asistenciaMap = {};
        asistenciaData.forEach(a => {
            asistenciaMap[a.id_inscripcion] = a.estado;
        });

        let html = `
            <div class="form-card">
                <h3 class="form-title">Estudiantes inscritos</h3>
        `;

        if (!inscritos.length) {
            html += `<p>No hay inscritos en este evento.</p>`;
        } else {
            html += `
                <div style="margin-bottom:10px;">
                    <select id="filtroAsistencia">
                        <option value="">Todos</option>
                        <option value="asistio">Asistieron</option>
                        <option value="no">No asistieron</option>
                    </select>
                </div>

                <table class="table-modern" id="tablaInscritos">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Fecha inscripción</th>
                            <th>Asistencia</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            inscritos.forEach((i) => {
                html += `
                    <tr>
                        <td>${i.primer_nombre} ${i.primer_apellido}</td>
                        <td>${i.correo_institucional}</td>
                        <td>${i.fecha}</td>
                        <td>
                            <input type="checkbox"
                                class="check-asistencia"
                                data-id="${i.id_inscripcion}"
                                ${asistenciaMap[i.id_inscripcion] === "Asistio" ? "checked" : ""}
                                disabled>
                        </td>
                    </tr>
                `;
            });

            html += `
                    </tbody>
                </table>
            `;
        }

        html += `
                <div class="form-actions">
                    <button class="btn-cancel" onclick="cerrarModal()">Cerrar</button>
                </div>
            </div>
        `;

        abrirModal(html);

        setTimeout(() => {
            if (!$("#tablaInscritos").length) return;

            const nombreLimpio = (nombreEvento || "Evento")
                .replace(/\s+/g, "_")
                .replace(/[^\w\-]/g, "");

            const tabla = $("#tablaInscritos").DataTable({
                pageLength: 5,
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '📥 Exportar a Excel',
                        title: `Inscritos_${nombreLimpio}`,
                        exportOptions: {
                            columns: [0, 1, 2, 3],
                            format: {
                                body: function (data, row, column, node) {
                                    if (column === 3) {
                                        return $(node).find("input").is(":checked")
                                            ? "Asistió"
                                            : "No asistió";
                                    }
                                    return data;
                                }
                            }
                        }
                    }
                ],
                language: {
                    search: "Buscar:",
                    lengthMenu: "Mostrar _MENU_ registros",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                    paginate: {
                        next: "Siguiente",
                        previous: "Anterior"
                    }
                }
            });

            $("#filtroAsistencia").off("change").on("change", function () {
                const valor = this.value;

                tabla.rows().every(function () {
                    const checkbox = $(this.node()).find(".check-asistencia");
                    const checked = checkbox.is(":checked");

                    if (valor === "asistio" && !checked) {
                        $(this.node()).hide();
                    } else if (valor === "no" && checked) {
                        $(this.node()).hide();
                    } else {
                        $(this.node()).show();
                    }
                });
            });
        }, 200);

    } catch (error) {
        console.log("Error cargando inscritos:", error);
        mostrarAlerta(error.message || "Error inesperado", "error");
    }
}

function abrirModal(contenido) {
    const modal = document.getElementById("modal");
    if (modal) modal.abrir(contenido);
}

function cerrarModal() {
    const modal = document.getElementById("modal");
    if (modal) modal.cerrar();
}

/* ================================= */
/* INICIO                            */
/* ================================= */

cargarEventos();