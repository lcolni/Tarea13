const aviso = document.querySelector('#aviso');
const ficha = document.querySelector('#ficha');
const form = document.querySelector('#formulario');
const titulo = document.querySelector('#titulo');
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

function opcionMarca(marca, seleccionada) {
    const opcion = document.createElement('option');
    opcion.value = marca.id_marca;
    opcion.textContent = marca.nombre_marca + (marca.pais_origen ? ' (' + marca.pais_origen + ')' : '');
    opcion.selected = String(marca.id_marca) === String(seleccionada);
    return opcion;
}

function pintarFicha(auto) {
    const filas = [
        ['Marca', auto.nombre_marca || 'Sin marca'],
        ['País de origen', auto.pais_origen || '—'],
        ['Modelo', auto.modelo],
        ['Año', auto.anio || '—'],
        ['Precio', dinero(auto.precio)],
        ['Estado', auto.estado || '—']
    ];
    ficha.innerHTML = '';
    filas.forEach(([etiqueta, valor]) => {
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.textContent = etiqueta;
        dd.textContent = valor;
        ficha.append(dt, dd);
    });
    titulo.textContent = (auto.nombre_marca ? auto.nombre_marca + ' ' : '') + auto.modelo;
}

async function cargar() {
    if (!id) {
        mostrarAviso(aviso, 'error', 'Falta el identificador del auto.');
        form.hidden = true;
        return;
    }

    const [autoResp, marcasResp] = await Promise.all([
        API.request('/vehiculos/' + id),
        API.request('/marcas')
    ]);

    if (autoResp.status !== 'ok') {
        mostrarAviso(aviso, 'error', autoResp.message || 'No se encontró el auto');
        form.hidden = true;
        return;
    }

    const auto = autoResp.data;
    pintarFicha(auto);
    const select = form.querySelector('[name="id_marca"]');
    select.innerHTML = '<option value="">Elegí una marca</option>';
    (marcasResp.data || []).forEach((marca) => select.appendChild(opcionMarca(marca, auto.id_marca)));
    form.modelo.value = auto.modelo || '';
    form.anio.value = auto.anio || '';
    form.precio.value = auto.precio || '';
    form.estado.value = auto.estado || '';
}

form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    if (!form.reportValidity()) return;

    const respuesta = await API.request('/vehiculos/' + id, 'PUT', {
        id_marca: form.id_marca.value,
        modelo: form.modelo.value.trim(),
        anio: form.anio.value,
        precio: form.precio.value,
        estado: form.estado.value
    });

    if (respuesta.status !== 'ok') {
        mostrarAviso(aviso, 'error', respuesta.message || 'No se pudieron guardar los cambios');
        return;
    }

    pintarFicha(respuesta.data);
    mostrarAviso(aviso, 'ok', respuesta.message);
});

cargar();
