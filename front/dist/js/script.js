// front/dist/js/script.js
// Lógica de ESTA página: pedir los autos y pintarlos en la tabla.

const aviso = document.querySelector('#aviso');
const tabla = document.querySelector('#tabla');

function mostrarAviso(tipo, texto) {
    aviso.className = 'alert alert-' + tipo;
    aviso.textContent = texto;
}

function precioTexto(valor) {
    if (valor === null || valor === undefined || valor === '') {
        return '-';
    }
    return '$ ' + valor;
}

function filaAuto(auto) {
    const fila = document.createElement('tr');
    const link = './dist/pages/vehiculo.html?id=' + auto.id_vehiculo;

    const marca = document.createElement('td');
    marca.textContent = auto.nombre_marca || 'Sin marca';

    const modelo = document.createElement('td');
    const ver = document.createElement('a');
    ver.href = link;
    ver.textContent = auto.modelo;
    modelo.appendChild(ver);

    const anio = document.createElement('td');
    anio.textContent = auto.anio ? auto.anio : '-';

    const precio = document.createElement('td');
    precio.textContent = precioTexto(auto.precio);

    const estado = document.createElement('td');
    estado.textContent = auto.estado || '-';

    const accion = document.createElement('td');
    const boton = document.createElement('a');
    boton.className = 'btn btn-sm btn-outline-primary';
    boton.href = link;
    boton.textContent = 'Ver';
    accion.appendChild(boton);

    fila.append(marca, modelo, anio, precio, estado, accion);
    return fila;
}

async function cargarListado() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('creado') === '1') {
        mostrarAviso('success', 'El auto se guardó correctamente y ya figura en el listado.');
    }

    const respuesta = await API.request('/vehiculos');
    tabla.innerHTML = '';

    if (respuesta.status !== 'ok') {
        mostrarAviso('danger', respuesta.message || 'No se pudieron cargar los autos');
        return;
    }

    if (!respuesta.data.length) {
        tabla.innerHTML = '<tr><td colspan="6">Todavía no hay autos cargados.</td></tr>';
        return;
    }

    respuesta.data.forEach(function (auto) {
        tabla.appendChild(filaAuto(auto));
    });
}

cargarListado();
