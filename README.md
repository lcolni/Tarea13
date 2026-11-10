# Tarea 13 — Gestión de autos

Integrante: Luis Rodriguez

Web para ver, agregar y modificar los vehículos de la automotora. Usa la estructura de Docker de la clase, Bootstrap y la base `MARCAS` / `VEHICULOS` de `api/config/init.sql`.

## Cómo levantarla

Hace falta Docker Desktop encendido. En esta carpeta:

```bash
docker compose up -d
```

La primera vez arma la imagen, crea la base e importa las marcas y los autos de prueba. En Docker el proyecto se llama `tarea_13`.

## Direcciones

- Listado: http://localhost:8080
- Agregar auto: http://localhost:8080/front/dist/pages/agregar.html
- API: http://localhost:8080/api/vehiculos
- phpMyAdmin: http://localhost:8081 (servidor `db`, usuario `root`, contraseña `root_password`)

## Variables de entorno

Están en `.env` y en `api/.env`. La web se conecta al servicio `db` de Docker con la base `mi_base_de_datos`.

## Para frenarla

```bash
docker compose down
```
