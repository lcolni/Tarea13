// Datos de un auto y formulario para modificarlo.

const aviso = document.querySelector('#aviso');
const ficha = document.querySelector('#ficha');
const form = document.querySelector('#formulario');
const titulo = document.querySelector('#titulo');
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

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

function pintarFicha(auto) {
    const filas = [
        ['Marca', auto.nombre_marca || 'Sin marca'],
        ['País de origen', auto.pais_origen || '-'],
        ['Modelo', auto.modelo],
        ['Año', auto.anio || '-'],
        ['Precio', precioTexto(auto.precio)],
        ['Estado', auto.estado || '-']
    ];

    ficha.innerHTML = '';
    filas.forEach(function (item) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        const td = document.createElement('td');
        th.textContent = item[0];
        td.textContent = item[1];
        tr.append(th, td);
        ficha.appendChild(tr);
    });

    titulo.textContent = (auto.nombre_marca ? auto.nombre_marca + ' ' : '') + auto.modelo;
}

function cargarMarcas(marcas, idMarca) {
    const select = form.querySelector('[name="id_marca"]');
    select.innerHTML = '<option value="">Elegí una marca</option>';
    marcas.forEach(function (marca) {
        const opcion = document.createElement('option');
        opcion.value = marca.id_marca;
        opcion.textContent = marca.nombre_marca;
        if (marca.pais_origen) {
            opcion.textContent += ' (' + marca.pais_origen + ')';
        }
        if (String(marca.id_marca) === String(idMarca)) {
            opcion.selected = true;
        }
        select.appendChild(opcion);
    });
}

async function cargar() {
    if (!id) {
        mostrarAviso('danger', 'Falta el id del auto.');
        form.classList.add('d-none');
        return;
    }

    const autoResp = await API.request('/vehiculos/' + id);
    const marcasResp = await API.request('/marcas');

    if (autoResp.status !== 'ok') {
        mostrarAviso('danger', autoResp.message || 'No se encontró el auto');
        form.classList.add('d-none');
        return;
    }

    const auto = autoResp.data;
    pintarFicha(auto);
    cargarMarcas(marcasResp.data || [], auto.id_marca);
    form.modelo.value = auto.modelo || '';
    form.anio.value = auto.anio || '';
    form.precio.value = auto.precio || '';
    form.estado.value = auto.estado || '';
}

form.addEventListener('submit', async function (evento) {
    evento.preventDefault();
    if (!form.reportValidity()) {
        return;
    }

    const respuesta = await API.request('/vehiculos/' + id, 'PUT', {
        id_marca: form.id_marca.value,
        modelo: form.modelo.value.trim(),
        anio: form.anio.value,
        precio: form.precio.value,
        estado: form.estado.value
    });

    if (respuesta.status !== 'ok') {
        mostrarAviso('danger', respuesta.message || 'No se pudieron guardar los cambios');
        return;
    }

    pintarFicha(respuesta.data);
    mostrarAviso('success', respuesta.message);
});

cargar();
