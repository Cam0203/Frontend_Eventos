//ALERTA//
class AppAlerta extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const mensaje = this.getAttribute("mensaje") || "";
        const tipo = this.getAttribute("tipo") || "exito";

        this.innerHTML = `
            <div class="alerta ${tipo}">
                ${mensaje}
            </div>
        `;

        setTimeout(() => {
            this.remove();
        }, 3000);
    }
}

customElements.define("app-alerta", AppAlerta);

//EVENT-CARD//
class EventCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const data = JSON.parse(this.getAttribute("data"));
        const modo = this.getAttribute("modo") || "admin";

        this.innerHTML = `
            <div class="event-card">
                <span class="event-badge">${data.modalidad || "Sin modalidad"}</span>
                <h4>${data.nombre || "Sin nombre"}</h4>
                <p><strong>Descripción:</strong> ${data.descripcion || "Sin descripción"}</p>
                <p><strong>Fecha:</strong> ${data.fecha || "No definida"}</p>
                <p><strong>Hora:</strong> ${data.hora || "No definida"}</p>
                <p><strong>Ponente:</strong> ${data.ponente || "No asignado"}</p>
                <p><strong>Inscritos:</strong> ${data.inscritos} / ${data.cupo_max ?? 0}</p>
                <p>
                    <strong>Estado:</strong>
                    <span class="${(data.estado || '').toLowerCase() === 'finalizado' ? 'finalizado' : ''}">
                        ${data.estado || "Sin estado"}
                    </span>
                </p>
                <p><strong>Lugar:</strong> ${data.lugar}</p>

                <div class="event-actions">
                    ${
                        modo === "admin"
                        ? `
                            <button class="btn-edit" onclick="editarEvento(${data.id})">Editar</button>
                            <button class="btn-secondary" onclick="verInscritos(${data.id}, '${data.nombre}', '${data.fecha}')">Ver inscritos</button>
                        `
                        : `
                            <button 
                                class="${data.inscrito ? 'btn-inscrito' : 'btn-inscribir'}"
                                onclick="${
                                    data.estado === 'Finalizado'
                                        ? ''
                                        : data.inscrito
                                            ? `cancelarInscripcion(${data.id})`
                                            : `inscribirse(${data.id})`
                                }"
                                ${(
                                    (data.lleno && !data.inscrito) ||
                                    data.estado === 'Finalizado'
                                ) ? "disabled" : ""}
                            >
                                ${
                                    data.estado === "Finalizado"
                                        ? "Evento finalizado"
                                        : data.lleno && !data.inscrito
                                            ? "Evento lleno"
                                            : (data.inscrito ? "Cancelar inscripción" : "Inscribirme")
                                }
                            </button>
                        `
                    }
                </div>
        `;
    }
}

customElements.define("event-card", EventCard);

//MODAL//
class AppModal extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="modal">
                <div class="modal-content">
                    <span class="cerrar">&times;</span>
                    <div class="modal-body"></div>
                </div>
            </div>
        `;

        const cerrarBtn = this.querySelector(".cerrar");
        const modal = this.querySelector(".modal");

        cerrarBtn.addEventListener("click", () => this.cerrar());
        modal.addEventListener("click", (e) => {
            if (e.target.classList.contains("modal")) {
                this.cerrar();
            }
        });
    }

    abrir(contenido) {
        this.querySelector(".modal-body").innerHTML = contenido;
        this.querySelector(".modal").classList.add("active");
    }

    cerrar() {
        this.querySelector(".modal").classList.remove("active");
        this.querySelector(".modal-body").innerHTML = "";
    }
}

customElements.define("app-modal", AppModal);

//FORM//
class AppFormEvento extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const modo = this.getAttribute("modo") || "crear";
        const data = this.getAttribute("data")
            ? JSON.parse(this.getAttribute("data"))
            : {};

        this.innerHTML = `
        <div class="form-card">
            <h3 class="form-title">
                ${modo === "editar" ? "Editar evento" : "Crear evento"}
            </h3>

            <div class="form-grid">
                <div class="form-group">
                    <label>Nombre del evento</label>
                    <input id="nombre" value="${data.nombre ?? ""}">
                </div>

                <div class="form-group">
                    <label>Descripción</label>
                    <input id="descripcion" value="${data.descripcion ?? ""}">
                </div>

                <div class="form-group">
                    <label>Fecha</label>
                    <input type="date" id="fecha" value="${data.fecha ?? ""}">
                </div>

                <div class="form-group">
                    <label>Hora</label>
                    <input type="time" id="hora" value="${data.hora ?? ""}">
                </div>

                <div class="form-group">
                    <label>Cupo máximo</label>
                    <input type="number" id="cupo_max" value="${data.cupo_max ?? ""}">
                </div>

                <div class="form-group">
                    <label>Modalidad</label>
                    <select id="modalidad">
                        <option value="">Seleccione modalidad</option>
                        <option value="Presencial" ${data.modalidad === "Presencial" ? "selected" : ""}>Presencial</option>
                        <option value="Virtual" ${data.modalidad === "Virtual" ? "selected" : ""}>Virtual</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Estado</label>
                    <select id="estado">
                        <option value="">Seleccione estado</option>
                        <option value="Programado" ${data.estado?.toLowerCase() === "programado" ? "selected" : ""}>Programado</option>
                        <option value="En curso" ${data.estado?.toLowerCase() === "en curso" ? "selected" : ""}>En curso</option>
                        <option value="Finalizado" ${data.estado?.toLowerCase() === "finalizado" ? "selected" : ""}>Finalizado</option>
                        <option value="Cancelado" ${data.estado?.toLowerCase() === "cancelado" ? "selected" : ""}>Cancelado</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Ponente</label>
                    <select id="ponente"></select>
                </div>

                <div class="form-group full">
                    <label>Lugar</label>
                    <select id="lugar"></select>
                </div>
            </div>

            <div class="form-actions">
                ${
                    modo === "editar"
                        ? `<button class="btn-save" onclick="actualizarEvento(${data.id})">Actualizar evento</button>`
                        : `<button class="btn-save" onclick="crearEvento()">Guardar evento</button>`
                }
                <button class="btn-cancel" onclick="cerrarModal()">Cancelar</button>
            </div>
        </div>
        `;

        // cargar selects después de renderizar
        setTimeout(() => {
            if (typeof cargarPonentes === "function") {
                cargarPonentes(data.id_ponente);
            }
            if (typeof cargarLugares === "function") {
                cargarLugares(data.id_lugar);
            }
        }, 100);
    }
}

customElements.define("app-form-evento", AppFormEvento);

//BUSCADOR//
class AppBuscador extends HTMLElement {
    constructor() {
        super();
        this.timeout = null;
    }

    connectedCallback() {
        this.innerHTML = `
            <input
                type="text"
                placeholder="Buscar por nombre del evento..."
                class="input-buscador search-input"
            />
        `;

        const input = this.querySelector("input");

        input.addEventListener("input", () => {
            clearTimeout(this.timeout);

            this.timeout = setTimeout(() => {
                this.buscar();
            }, 300);
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this.buscar();
            }
        });
    }

    buscar() {
        const input = this.querySelector("input");
        const valor = input.value;

        this.dispatchEvent(new CustomEvent("buscar", {
            detail: valor
        }));
        }
    }

customElements.define("app-buscador", AppBuscador);

//STATSCARD//
class AppStatsCard extends HTMLElement {
    connectedCallback() {
        const titulo = this.getAttribute("titulo") || "";
        const icono = this.getAttribute("icono") || "";
        const tipo = this.getAttribute("tipo") || "";

        let id = "";

        if (tipo === "total") id = "totalEventos";
        if (tipo === "activos") id = "eventosActivos";
        if (tipo === "proximos") id = "proximosEventos";
        if (tipo === "mis") id = "misInscripciones";

        this.innerHTML = `
            <article class="stat-card">
                <div class="stat-icon ${tipo}">
                    ${icono}
                </div>
                <div>
                    <h3 id="${id}">0</h3>
                    <p>${titulo}</p>
                </div>
            </article>
        `;
    }
}

customElements.define("app-stats-card", AppStatsCard);

//SIDEBARD//
class AppSidebar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <aside class="sidebar collapsed">
                <div class="sidebar-top">
                    <div class="logo-circle" id="sidebarToggle">
                        <img src="../img/logo-cul-.png" alt="Logo CUL" class="logo-cul" />
                    </div>
                    <div class="brand-text">
                        <h2>Portal CUL</h2>
                        <p>Gestión de Eventos</p>
                    </div>
                </div>

                <nav class="sidebar-menu">
                    <a href="#" class="menu-item active" id="btnDashboard">
                        <span>📊</span>
                        <span>Dashboard</span>
                    </a>

                    <a href="#events-section" class="menu-item">
                        <span>📅</span>
                        <span>Eventos</span>
                    </a>

                    <a href="#" class="menu-item" id="btnCerrarSesion">
                        <span>🚪</span>
                        <span>Cerrar sesión</span>
                    </a>
                </nav>
            </aside>
        `;

        this.inicializarEventos();
    }

    inicializarEventos() {
        const sidebar = this.querySelector("aside");
        const toggle = this.querySelector("#sidebarToggle");
        const cerrar = this.querySelector("#btnCerrarSesion");
        const dashboard = this.querySelector("#btnDashboard");

        if (toggle) {
            toggle.addEventListener("click", () => {
                sidebar.classList.toggle("collapsed");
            });
        }

        if (cerrar) {
            cerrar.addEventListener("click", () => {
                if (typeof cerrarSesion === "function") {
                    cerrarSesion();
                }
            });
        }

        if (dashboard) {
            dashboard.addEventListener("click", (e) => {
                const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
                const rol = Number(usuario.id_rol);

                // Admin abre modal
                if (rol === 3) {
                    e.preventDefault();

                    const modal = document.getElementById("modal");
                    if (modal && typeof modal.abrir === "function") {
                        modal.abrir(`
                            <div class="form-card">
                                <h3 class="form-title">Dashboard Power BI</h3>
                                <div style="margin-top: 16px;">
                                    <p style="margin-bottom: 12px; color: #475569;">
                                        Aquí se visualizará el dashboard de Power BI.
                                    </p>
                                    <iframe
                                        src=""
                                        width="100%"
                                        height="500"
                                        frameborder="0"
                                        allowFullScreen="true"
                                        style="border-radius: 12px; background: #f8fafc;">
                                    </iframe>
                                </div>
                                <div class="form-actions">
                                    <button class="btn-cancel" onclick="cerrarModal()">Cerrar</button>
                                </div>
                            </div>
                        `);
                    }
                } 
                
                // Estudiante y coordinador bajan a estadísticas
                else {
                    e.preventDefault();
                    const statsSection = document.getElementById("stats-section");
                    if (statsSection) {
                        statsSection.scrollIntoView({ behavior: "smooth" });
                    }
                }
            });
        }
    }
}


customElements.define("app-sidebar", AppSidebar);

//TOPBARD//
class AppTopbar extends HTMLElement {
    connectedCallback() {
        const titulo = this.getAttribute("titulo") || "Panel";
        const subtitulo = this.getAttribute("subtitulo") || "";

        this.innerHTML = `
            <header class="topbar">
                <div>
                    <h1>${titulo}</h1>
                    <p>${subtitulo}</p>
                </div>

                <div class="topbar-user">
                    <div class="user-badge">
                        <span class="user-role" id="bienvenida"></span>
                    </div>
                </div>
            </header>
        `;

        this.cargarUsuario();
    }

    cargarUsuario() {
        const usuario = JSON.parse(localStorage.getItem("usuario"));

        if (!usuario) {
            window.location.href = "login.html";
            return;
        }

        const nombre =
            usuario.usuario ||
            usuario.nombre ||
            usuario.primer_nombre ||
            "Usuario";

        const bienvenida = this.querySelector("#bienvenida");

        if (bienvenida) {
            bienvenida.innerText = "Bienvenido " + nombre;
        }
    }
}

customElements.define("app-topbar", AppTopbar);

//LISTAREVENTOS//
class AppListaEventos extends HTMLElement {
    constructor() {
        super();
        this.eventos = [];
    }

    connectedCallback() {
        this.render();
    }

    set data(eventos) {
        this.eventos = eventos || [];
        this.render();
    }

    render() {
        if (!this.eventos.length) {
            this.innerHTML = `
                <div class="empty-state">
                    <h4>No hay eventos registrados</h4>
                    <p>No se encontraron eventos para mostrar.</p>
                </div>
            `;
            return;
        }

        let html = "";

        this.eventos.forEach((e) => {
            const modo = this.getAttribute("modo") || "admin";

            html += `
                <event-card 
                    modo="${modo}"
                    data='${JSON.stringify(e)}'>
                </event-card>
            `;
        });

        this.innerHTML = `<div class="events-grid">${html}</div>`;
    }
}

customElements.define("app-lista-eventos", AppListaEventos);

/* SECTION HEADER*/ 
class AppSectionHeader extends HTMLElement {
    connectedCallback() {
        const titulo = this.getAttribute("titulo") || "";
        const subtitulo = this.getAttribute("subtitulo") || "";
        const centered = this.getAttribute("center") === "true" ? "center" : "";

        this.innerHTML = `
            <div class="section-header ${centered}">
                <h3>${titulo}</h3>
                <p>${subtitulo}</p>
            </div>
        `;
    }
}

customElements.define("app-section-header", AppSectionHeader);

/* ESTADO EVENTO*/

function getEstadoEvento(fechaEvento) {
    const hoy = new Date();
    const fecha = new Date(fechaEvento);

    const finalizado = fecha < hoy;

    return {
        finalizado,
        texto: finalizado ? "Finalizado" : "Activo",
        editable: !finalizado
    };
}