const aviso = document.querySelector('#aviso');
const form = document.querySelector('#formulario');
const select = form.querySelector('[name="id_marca"]');

async function cargarMarcas() {
    const respuesta = await API.request('/marcas');
    if (respuesta.status !== 'ok') {
        mostrarAviso(aviso, 'error', respuesta.message || 'No se pudieron cargar las marcas');
        return;
    }
    respuesta.data.forEach((marca) => {
        const opcion = document.createElement('option');
        opcion.value = marca.id_marca;
        opcion.textContent = marca.nombre_marca + (marca.pais_origen ? ' (' + marca.pais_origen + ')' : '');
        select.appendChild(opcion);
    });
}

form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    if (!form.reportValidity()) return;

    const respuesta = await API.request('/vehiculos', 'POST', {
        id_marca: form.id_marca.value,
        modelo: form.modelo.value.trim(),
        anio: form.anio.value,
        precio: form.precio.value,
        estado: form.estado.value
    });

    if (respuesta.status !== 'ok') {
        mostrarAviso(aviso, 'error', respuesta.message || 'No se pudo guardar el auto');
        return;
    }

    window.location.href = '/front/index.html?creado=1';
});

cargarMarcas();
