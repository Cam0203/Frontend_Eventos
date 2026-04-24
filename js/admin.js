
    const BASE_URL = "https://backend-eventos-rth3.onrender.com";

    const API = `${BASE_URL}/eventos`;
    const API_INSCRIBE = `${BASE_URL}/inscribe`;
    const API_PONENTES = `${BASE_URL}/ponente`;
    const API_LUGARES = `${BASE_URL}/lugar/`;
    const API_ASISTENCIA = `${BASE_URL}/asistencia`;

        let eventosAdmin = [];
        let filtroEstadoActual = "todos";
        let textoBusquedaActual = "";
    
    /* ========================= */
    /* INICIO */
    /* ========================= */
    document.addEventListener("DOMContentLoaded", () => {
    inicializarBuscador();
    inicializarModal();
    cargarEventos();
    });


    /* ========================= */
    /* BUSCADOR */
    /* ========================= */
    function inicializarBuscador() {
        const buscador = document.querySelector("app-buscador");

        if (!buscador) return;

        buscador.addEventListener("buscar", (e) => {
            buscarEventoAdmin(e.detail);
        });
    }

    /* ========================= */
    /* MODAL */
    /* ========================= */
    function inicializarModal() {
    const modal = document.getElementById("modal");

    if (!modal) return;

    modal.addEventListener("click", (e) => {
        if (e.target.id === "modal") {
        cerrarModal();
        }
    });
    }

    function abrirModal(contenido) {
        const modal = document.getElementById("modal");
        if (modal) modal.abrir(contenido);
    }

    function cerrarModal() {
        const modal = document.getElementById("modal");
        if (modal) modal.cerrar();
    }

    /* ========================= */
    /* CARGAR EVENTOS */
    /* ========================= */
    async function cargarEventos() {
    try {
        const res = await fetch(API);

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Error en el servidor");
        }

        const eventos = await res.json();
        await mostrarEventos(eventos);

    } catch (error) {
        console.error("Error cargando eventos:", error);
        mostrarAlerta(error.message || "Error inesperado", "error");

        const listaEventos = document.getElementById("listaEventos");
        if (listaEventos) {
        listaEventos.innerHTML = `
            <div class="empty-state">
            <h4>Error al cargar eventos</h4>
            <p>No fue posible obtener la información desde el servidor.</p>
            </div>
        `;
        }
    }
    }

    /* ========================= */
    /* BUSCAR EVENTO */
    /* ========================= */
    /* async function buscarEvento() {
        const buscador = document.querySelector("app-buscador input");
        const texto = buscador ? buscador.value.trim().toLowerCase() : "";

        try {
            const res = await fetch(API);

            if (!res.ok) {
            throw new Error("No se pudo consultar la API");
            }

            const eventos = await res.json();

            if (!texto) {
            await mostrarEventos(eventos);
            actualizarIndicadores(eventos);
            return;
            }

            const filtrados = eventos.filter((e) => {
                const nombre = (e.nombre || "").toLowerCase().trim();

                return nombre === texto || nombre.startsWith(texto);
            });
            await mostrarEventos(filtrados);
            actualizarIndicadores(eventos);
        } catch (error) {
            console.error("Error buscando eventos:", error);
            mostrarAlerta(error.message || "Error inesperado", "error");
        }
        }*/

        function buscarEventoAdmin(texto) {
            textoBusquedaActual = (texto || "").toLowerCase().trim();
            aplicarFiltrosAdmin();
        }
    /* ========================= */
    /* MOSTRAR EVENTOS */
    /* ========================= */
    async function mostrarEventos(eventos) {
        const contenedor = document.getElementById("listaEventos");
        if (!contenedor) return;

        // ⚠️ Si no hay eventos
        if (!eventos || eventos.length === 0) {
            contenedor.data = []; // usamos el componente
            return;
        }

        try {
            const resLugares = await fetch(API_LUGARES);
            const listaLugares = resLugares.ok ? await resLugares.json() : [];

            const listaProcesada = [];

            for (const e of eventos) {
                let inscritos = 0;

                try {
                    const resInscritos = await fetch(`${API_INSCRIBE}/evento/${e.id}`);
                    if (resInscritos.ok) {
                        const dataInscritos = await resInscritos.json();
                        inscritos = Array.isArray(dataInscritos) ? dataInscritos.length : 0;
                    }
                } catch (error) {
                    console.log("Error contando inscritos para el evento " + e.id);
                }

                const datosLugar = listaLugares.find(
                    (l) => String(l.id) === String(e.id_lugar)
                );

                const nombreDelLugar = datosLugar ? datosLugar.nombre : "No asignado";

                const estado = getEstadoEvento(e.fecha);

                let estadoVisible = e.estado || "Sin estado";

                console.log("EVENTO ORIGINAL:", e.nombre, " | fecha:", e.fecha, " | estado BD:", e.estado);
                console.log("ESTADO VISIBLE:", e.nombre, "=>", estadoVisible);

                listaProcesada.push({
                    id: e.id,
                    nombre: e.nombre,
                    descripcion: e.descripcion,
                    fecha: e.fecha,
                    hora: e.hora,
                    modalidad: e.modalidad,
                    estado: estadoVisible,
                    finalizado: estado.finalizado,
                    cupo_max: e.cupo_max,
                    inscritos: inscritos,
                    ponente: e.primer_nombre
                        ? `${e.primer_nombre} ${e.primer_apellido ?? ""}`.trim()
                        : "No asignado",
                    lugar: nombreDelLugar
                });
            }

            eventosAdmin = listaProcesada;
            contenedor.data = listaProcesada;
            actualizarIndicadores(listaProcesada);

        } catch (error) {
            console.error("Error general en mostrarEventos:", error);

            contenedor.data = []; // fallback limpio

            mostrarAlerta(
                "Ocurrió un problema al mostrar los eventos",
                "error"
            );
        }
    }

    //FILTRARPORESTADO//
    function filtrarPorEstado(estado) {
        filtroEstadoActual = estado || "todos";
        aplicarFiltrosAdmin();
    }

    //APLICAR FILTRAR POR ESTADO EN BUSCADOR//
    function aplicarFiltrosAdmin() {
        const contenedor = document.getElementById("listaEventos");
        if (!Array.isArray(eventosAdmin) || !contenedor) return;

        let filtrados = [...eventosAdmin];

        // filtrar por estado
        if (filtroEstadoActual !== "todos") {
            filtrados = filtrados.filter(e =>
                (e.estado || "").toLowerCase() === filtroEstadoActual.toLowerCase()
            );
        }

        // filtrar por texto
        if (textoBusquedaActual) {
            filtrados = filtrados.filter(e =>
                (e.nombre || "").toLowerCase().includes(textoBusquedaActual)
            );
        }

        contenedor.data = filtrados;
        actualizarIndicadores(filtrados);
}

    /* ========================= */
    /* ACTUALIZAR INDICADORES */
    /* ========================= */
    function actualizarIndicadores(eventos) {
    const hoy = new Date().toISOString().split("T")[0];

    const total = Array.isArray(eventos) ? eventos.length : 0;
    const activos = Array.isArray(eventos)
        ? eventos.filter(
            (e) =>
            e.estado?.toLowerCase() === "programado" ||
            e.estado?.toLowerCase() === "en curso"
        ).length
        : 0;

    const proximos = Array.isArray(eventos)
        ? eventos.filter((e) => e.fecha && e.fecha >= hoy).length
        : 0;

    const totalEl = document.getElementById("totalEventos");
    const activosEl = document.getElementById("eventosActivos");
    const proximosEl = document.getElementById("proximosEventos");

    if (totalEl) totalEl.textContent = total;
    if (activosEl) activosEl.textContent = activos;
    if (proximosEl) proximosEl.textContent = proximos;
    }

    /* ========================= */
    /* FORMULARIO EVENTO */
    /* ========================= */
    function mostrarFormulario() {
        abrirModal(`<app-form-evento modo="crear"></app-form-evento>`);
    }

    /* ========================= */
    /* CANCELAR FORMULARIO */
    /* ========================= */
    function cancelarFormulario() {
    cerrarModal();

    const formEvento = document.getElementById("formEvento");
    if (formEvento) {
        formEvento.innerHTML = "";
    }
    }

    /* ========================= */
    /* CARGAR LUGARES */
    /* ========================= */
    async function cargarLugares(lugarSeleccionado = null) {
    try {
        const res = await fetch(API_LUGARES);
        if (!res.ok) throw new Error("No se pudieron cargar los lugares");

        const lugares = await res.json();
        const select = document.getElementById("lugar");

        if (!select) return;

        select.innerHTML = "<option value=''>Seleccione un lugar</option>";

        lugares.forEach((l) => {
        const option = document.createElement("option");
        option.value = l.id;
        option.textContent = l.nombre;

        if (String(l.id) === String(lugarSeleccionado)) {
            option.selected = true;
        }

        select.appendChild(option);
        });
    } catch (error) {
        console.log("Error cargando lugares:", error);
    }
    }

    /* ========================= */
    /* CARGAR PONENTES */
    /* ========================= */
    async function cargarPonentes(ponenteSeleccionado = null) {
    try {
        const res = await fetch(API_PONENTES);
        if (!res.ok) throw new Error("No se pudieron cargar los ponentes");

        const ponentes = await res.json();
        const select = document.getElementById("ponente");

        if (!select) return;

        select.innerHTML = "<option value=''>Seleccione un ponente</option>";

        ponentes.forEach((p) => {
        const nombreCompleto = `${p.primer_nombre} ${p.segundo_nombre ?? ""} ${p.primer_apellido} ${p.segundo_apellido ?? ""}`
            .replace(/\s+/g, " ")
            .trim();

        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = nombreCompleto;

        if (String(p.id) === String(ponenteSeleccionado)) {
            option.selected = true;
        }

        select.appendChild(option);
        });
    } catch (error) {
        console.log("Error cargando ponentes:", error);
    }
    }

    function obtenerDatosEvento() {
    return {
        nombre: document.getElementById("nombre")?.value?.trim() || "",
        descripcion: document.getElementById("descripcion")?.value?.trim() || "",
        fecha: document.getElementById("fecha")?.value || "",
        hora: document.getElementById("hora")?.value || "",
        cupo_max: Number(document.getElementById("cupo_max")?.value || 0),
        modalidad: document.getElementById("modalidad")?.value || "",
        estado: document.getElementById("estado")?.value || "",
        id_ponente: Number(document.getElementById("ponente")?.value || 0),
        id_lugar: Number(document.getElementById("lugar")?.value || 0),
        id_categoria_evento: 1
    };
}

        function validarEvento(data) {
    if (!data.nombre) {
        mostrarAlerta("El nombre del evento es obligatorio", "error");
        return false;
    }
    if (!data.descripcion) {
        mostrarAlerta("La descripción es obligatoria", "error");
        return false;
    }
    if (!data.fecha) {
        mostrarAlerta("La fecha es obligatoria", "error");
        return false;
    }
    if (!data.hora) {
        mostrarAlerta("La hora es obligatoria", "error");
        return false;
    }
    if (data.cupo_max <= 0) {
        mostrarAlerta("El cupo debe ser mayor a 0", "error");
        return false;
    }
    if (!data.modalidad) {
        mostrarAlerta("Debes seleccionar una modalidad", "error");
        return false;
    }
    if (!data.estado) {
        mostrarAlerta("Debes seleccionar un estado", "error");
        return false;
    }
    if (!data.id_ponente || data.id_ponente === 0) {
        mostrarAlerta("Debes seleccionar un ponente", "error");
        return false;
    }
    if (!data.id_lugar || data.id_lugar === 0) {
        mostrarAlerta("Debes seleccionar un lugar", "error");
        return false;
    }

    const hoy = new Date().toISOString().split("T")[0];
    if (data.fecha < hoy) {
        mostrarAlerta("No puedes seleccionar una fecha pasada", "error");
        return false;
    }

    return true;
}
    /* ========================= */
    /* CREAR EVENTO */
    /* ========================= */
    async function crearEvento() {
    const data = obtenerDatosEvento();

    if (!validarEvento(data)) return;
        
    try {
        const res = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
        });

        if (res.ok) {
        mostrarAlerta("Evento creado correctamente", "exito");
        await enviarNotificacionCorreo();
        cancelarFormulario();
        await cargarEventos();
        } else {
        mostrarAlerta("Error creando evento", "error");
        }
    } catch (error) {
        console.error("Error creando evento:", error);
        mostrarAlerta(error.message || "Error inesperado", "error");
    }
    }

    /* ========================= */
    /* EDITAR EVENTO */
    /* ========================= */
    async function editarEvento(id) {
        
    try {
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) throw new Error("No se pudo consultar el evento");

        const e = await res.json();
        console.log("EVENTO:", e);
        abrirModal(`
            <app-form-evento 
                modo="editar" 
                data='${JSON.stringify(e)}'>
            </app-form-evento>
        `);
        
        setTimeout(() => {
            cargarPonentes(e.id_ponente);
            cargarLugares(e.id_lugar);
        }, 100);
    } catch (error) {
        console.error("Error editando evento:", error);
        mostrarAlerta(error.message || "Error inesperado", "error");
    }
    }

    /* ========================= */
    /* ACTUALIZAR EVENTO */
    /* ========================= */
    async function actualizarEvento(id) {
    const data = obtenerDatosEvento();
        if (!validarEvento(data)) return;

    const hoy = new Date().toISOString().split("T")[0];

        if (data.fecha < hoy) {
        mostrarAlerta("No puedes seleccionar una fecha pasada", "error");
        return;
}
    try {
        const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
        });

        if (res.ok) {
        mostrarAlerta("Evento actualizado correctamente", "exito");
        cancelarFormulario();
        await cargarEventos();
        } else {
        mostrarAlerta("Error actualizando evento", "error");
        }
    } catch (error) {
        console.error("Error actualizando evento:", error);
        mostrarAlerta("No se pudo conectar con el servidor", "error");
    }
    }


    /* ========================= */
    /* VER INSCRITOS */
    /* ========================= */
    async function verInscritos(id_evento, nombreEvento, fechaEvento){
        try {
            const res = await fetch(`${API_INSCRIBE}/evento/${id_evento}`);
            if (!res.ok) throw new Error("No se pudieron cargar los inscritos");

            const inscritos = await res.json();

            const estadoEvento = getEstadoEvento(fechaEvento);
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
                                ${estadoEvento.finalizado ? "disabled" : ""}>
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
                    <button class="btn-cancel" onclick="cancelarFormulario()">Cerrar</button>
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

                // 🔥 EVENTO CORRECTO (DELEGACIÓN - NO FALLA CON DATATABLE)
                $(document).off("change", ".check-asistencia");

                $(document).on("change", ".check-asistencia", async function () {

                    const id = $(this).data("id");
                    const asistio = this.checked;

                    console.log("ID inscripción:", id);
                    console.log("Asistencia:", asistio);

                    try {
                        await fetch(`${API_ASISTENCIA}/`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                id_inscribe: id,
                                estado: asistio ? "Asistio" : "No asistio"
                            })
                        });

                    } catch (error) {
                        console.error("Error guardando asistencia:", error);
                    }
                });

                // 🔥 FILTRO CORRECTO
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
        /* ========================= */
    /* ALERTAS */
    /* ========================= */
    function mostrarAlerta(mensaje, tipo = "exito") {
        const contenedor = document.getElementById("alerta-container");
        if (!contenedor) return;

        const alerta = document.createElement("app-alerta");
        alerta.setAttribute("mensaje", mensaje);
        alerta.setAttribute("tipo", tipo);

        contenedor.appendChild(alerta);
    }

    /* ========================= */
    /* NOTIFICACIONES */
    /* ========================= */
    async function enviarNotificacionCorreo() {
    try {
        const res = await fetch(`${BASE_URL}/usuarios/`);

        if (!res.ok) {
        throw new Error("No se pudieron consultar los usuarios");
        }

        const usuarios = await res.json();

        console.log("📧 Enviando correos a:");
        usuarios.forEach((u) => {
        console.log("Correo enviado a:", u.correo_institucional);
        });

        mostrarAlerta("Notificación enviada a los usuarios", "exito");
    } catch (error) {
        console.log("Error enviando correos:", error);
        mostrarAlerta("Error al enviar notificaciones", "error");
    }
    }


/* ================================= */
/* CERRAR SESIÓN                     */
/* ================================= */

function cerrarSesion(){
    sessionStorage.removeItem("usuario");
    window.location.href = "login.html";
}

function mostrarTodosEventos() {
    const componente = document.getElementById("buscadorEventos");
    const input = componente?.querySelector("input");

    if (input) {
        input.value = "";
    }

    const select = document.getElementById("filtroEstado");
    if (select) {
        select.value = "todos";
    }

    textoBusquedaActual = "";
    filtroEstadoActual = "todos";

    aplicarFiltrosAdmin();
}

