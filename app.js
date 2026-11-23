// Motor de datos compatible con GitHub Pages (replica la estructura de la BD cecyjobs: categorias, usuarios, empleos, postulaciones)
const DB_KEY = "cecyjobs_db_v1";
const SESSION_KEY = "cecyjobs_session_v1";

const DEFAULT_DATA = {
    categorias: [
        { id: 1, nombre: "Mecánica", icono: "bi bi-wrench-adjustable" },
        { id: 2, nombre: "Plomería", icono: "bi bi-droplet-fill" },
        { id: 3, nombre: "Electricidad", icono: "bi bi-lightning-charge-fill" },
        { id: 4, nombre: "Carpintería", icono: "bi bi-hammer" },
        { id: 5, nombre: "Albañilería", icono: "bi bi-bricks" },
        { id: 6, nombre: "Otros", icono: "bi bi-briefcase-fill" }
    ],
    usuarios: [
        {
            id: 1,
            nombre: "Taller El Puma",
            email: "empleador@cecyjobs.com",
            password: "123456",
            telefono: "7121234567",
            rol: "empleador"
        }
    ],
    empleos: [
        {
            id: 1,
            usuario_id: 1,
            categoria_id: 1,
            titulo: "Mecánico automotriz",
            empresa: "Taller El Puma",
            descripcion: "Mantenimiento preventivo, afinaciones y reparación general de motores.",
            ubicacion: "Acambay, Estado de México",
            salario: 2500.00,
            tipo_pago: "Semanal",
            estatus: "activo",
            creado_en: "2026-11-20"
        },
        {
            id: 2,
            usuario_id: 1,
            categoria_id: 2,
            titulo: "Plomero residencial",
            empresa: "Servicios Hidráulicos del Norte",
            descripcion: "Instalación de tuberías, tinacos, calentadores solares y reparación de fugas.",
            ubicacion: "Atlacomulco, Estado de México",
            salario: 1800.00,
            tipo_pago: "Por servicio",
            estatus: "activo",
            creado_en: "2026-11-21"
        },
        {
            id: 3,
            usuario_id: 1,
            categoria_id: 3,
            titulo: "Electricista técnico",
            empresa: "Instalaciones Eléctricas MX",
            descripcion: "Cableado residencial, centros de carga e iluminación LED.",
            ubicacion: "Toluca, Estado de México",
            salario: 3200.00,
            tipo_pago: "Semanal",
            estatus: "activo",
            creado_en: "2026-11-22"
        }
    ],
    postulaciones: []
};

function getDB() {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
        localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DATA));
        return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
    return JSON.parse(raw);
}

function saveDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function getSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
}

function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
        usuario_id: user.id,
        nombre: user.nombre,
        rol: user.rol
    }));
}

function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "index.html";
}

function escapeHTML(str) {
    if (str === null || str === undefined) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatMoney(num) {
    return Number(num).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
}

function renderLayout(activePage) {
    const session = getSession();
    let navAuthHTML = "";

    if (session) {
        const empleadorItem = session.rol === "empleador"
            ? `<li><a class="dropdown-item" href="publicar-empleo.html">Publicar Empleo</a></li>`
            : "";
        navAuthHTML = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle"></i> ${escapeHTML(session.nombre)}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    ${empleadorItem}
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" onclick="logout(); return false;">Cerrar Sesión</a></li>
                </ul>
            </li>
        `;
    } else {
        navAuthHTML = `
            <li class="nav-item">
                <a class="nav-link ${activePage === "login.html" ? "active" : ""}" href="login.html">Ingresar</a>
            </li>
            <li class="nav-item">
                <a class="btn btn-light btn-sm ms-lg-2 mt-2 mt-lg-0" href="registro.html">Registrarse</a>
            </li>
        `;
    }

    const headerEl = document.getElementById("app-header");
    if (headerEl) {
        headerEl.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div class="container">
                <a class="navbar-brand fw-bold" href="index.html">
                    <i class="bi bi-briefcase-fill"></i> Cecy-Jobs
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="nav">
                    <ul class="navbar-nav ms-auto align-items-lg-center">
                        <li class="nav-item"><a class="nav-link active" href="index.html">Inicio</a></li>
                        <li class="nav-item"><a class="nav-link" href="empleos.html">Empleos</a></li>
                        <li class="nav-item"><a class="nav-link" href="publicar-empleo.html">Publicar</a></li>
                        ${navAuthHTML}
                    </ul>
                </div>
            </div>
        </nav>
        `;
    }

    const footerEl = document.getElementById("app-footer");
    if (footerEl) {
        footerEl.innerHTML = `
        <footer class="bg-dark text-white py-4 mt-5">
            <div class="container">
                <div class="row">
                    <div class="col-md-6">
                        <h5><i class="bi bi-briefcase-fill"></i>CecyJobs</h5>
                        <p class="text-white small mb-0">Oportunidad para todos</p>
                    </div>
                    <div class="col-md-6 text-md-end mt-3 mt-md-0">
                        <a href="" class="text-white me-3"><i class="bi bi-facebook"></i></a>
                        <a href="" class="text-white me-3"><i class="bi bi-whatsapp"></i></a>
                        <a href="" class="text-white me-3"><i class="bi bi-instagram"></i></a>
                        <a href="" class="text-white me-3"><i class="bi bi-telegram"></i></a>
                    </div>
                </div>
            </div>
        </footer>
        `;
    }
}
