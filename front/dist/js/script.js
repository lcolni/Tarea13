// Listado principal de vehículos.

const grilla = document.querySelector('#grilla');
const aviso = document.querySelector('#aviso');

function tarjeta(auto) {
    const estado = (auto.estado || '').toLowerCase();
    const enlace = document.createElement('a');
    enlace.className = 'auto-card';
    enlace.href = './dist/pages/vehiculo.html?id=' + auto.id_vehiculo;
    enlace.innerHTML = `
        <div class="marca">${auto.nombre_marca || 'Sin marca'}</div>
        <div class="modelo"></div>
        <div class="meta">
            <span></span>
            <strong class="precio"></strong>
        </div>
        <span class="estado ${estado}"></span>
    `;
    enlace.querySelector('.modelo').textContent = auto.modelo;
    enlace.querySelector('.meta span').textContent = auto.anio ? String(auto.anio) : 'Año sin cargar';
    enlace.querySelector('.precio').textContent = dinero(auto.precio);
    enlace.querySelector('.estado').textContent = auto.estado || 'Sin estado';
    return enlace;
}

async function cargarListado() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('creado') === '1') {
        mostrarAviso(aviso, 'ok', 'El auto se guardó correctamente y ya figura en el listado.');
    }

    const respuesta = await API.request('/vehiculos');
    grilla.innerHTML = '';
    if (respuesta.status !== 'ok') {
        mostrarAviso(aviso, 'error', respuesta.message || 'No se pudieron cargar los autos');
        return;
    }
    if (!respuesta.data.length) {
        grilla.innerHTML = '<p class="vacio">Todavía no hay autos cargados.</p>';
        return;
    }
    respuesta.data.forEach((auto) => grilla.appendChild(tarjeta(auto)));
}

cargarListado();
