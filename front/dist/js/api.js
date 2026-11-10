// front/dist/js/api.js
// El mensajero: el HTML nunca habla con PHP directo. Pasa por acá.

const API = {
    urlBase: '/api',

    async request(endpoint, method = 'GET', data = null) {
        const opciones = {
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };

        if (data) {
            opciones.body = JSON.stringify(data);
        }

        try {
            const respuesta = await fetch(this.urlBase + endpoint, opciones);
            const json = await respuesta.json();
            if (!json.status) {
                json.status = respuesta.ok ? 'ok' : 'error';
            }
            return json;
        } catch (error) {
            console.error('Error de conexión con la API:', error);
            return { status: 'error', message: 'No se pudo conectar con la API' };
        }
    }
};

function dinero(valor) {
    if (valor === null || valor === undefined || valor === '') return 'Sin precio';
    return '$ ' + Number(valor).toLocaleString('es-UY', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function mostrarAviso(elemento, tipo, texto) {
    elemento.hidden = false;
    elemento.className = 'aviso ' + tipo;
    elemento.textContent = texto;
}
