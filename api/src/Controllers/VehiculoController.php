<?php
namespace App\Controllers;

use App\Models\MarcaModel;
use App\Models\VehiculoModel;

class VehiculoController {
    private $vehiculos;
    private $marcas;

    public function __construct($db) {
        $this->vehiculos = new VehiculoModel($db);
        $this->marcas = new MarcaModel($db);
    }

    public function listar() {
        echo json_encode([
            'status' => 'ok',
            'data' => $this->vehiculos->listar(),
        ], JSON_UNESCAPED_UNICODE);
    }

    public function ver($id) {
        $auto = $this->vehiculos->buscar($id);
        if (!$auto) {
            $this->error(404, 'No se encontró el vehículo');
            return;
        }
        echo json_encode([
            'status' => 'ok',
            'data' => $auto,
        ], JSON_UNESCAPED_UNICODE);
    }

    public function crear() {
        $datos = $this->leerJson();
        $error = $this->validar($datos);
        if ($error) {
            $this->error(400, $error);
            return;
        }
        $id = $this->vehiculos->crear($this->normalizar($datos));
        http_response_code(201);
        echo json_encode([
            'status' => 'ok',
            'message' => 'El auto se guardó correctamente',
            'data' => $this->vehiculos->buscar($id),
        ], JSON_UNESCAPED_UNICODE);
    }

    public function actualizar($id) {
        if (!$this->vehiculos->buscar($id)) {
            $this->error(404, 'No se encontró el vehículo');
            return;
        }
        $datos = $this->leerJson();
        $error = $this->validar($datos);
        if ($error) {
            $this->error(400, $error);
            return;
        }
        $this->vehiculos->actualizar($id, $this->normalizar($datos));
        echo json_encode([
            'status' => 'ok',
            'message' => 'Los datos fueron modificados correctamente',
            'data' => $this->vehiculos->buscar($id),
        ], JSON_UNESCAPED_UNICODE);
    }

    private function leerJson() {
        $crudo = file_get_contents('php://input');
        $datos = json_decode($crudo, true);
        return is_array($datos) ? $datos : [];
    }

    private function validar($datos) {
        $modelo = trim((string) ($datos['modelo'] ?? ''));
        if ($modelo === '') {
            return 'El modelo es obligatorio';
        }
        if (strlen($modelo) > 50) {
            return 'El modelo no puede superar los 50 caracteres';
        }

        $idMarca = $datos['id_marca'] ?? null;
        if ($idMarca === null || $idMarca === '') {
            return 'Tenés que elegir una marca';
        }
        if (!ctype_digit((string) $idMarca) || !$this->marcas->existe($idMarca)) {
            return 'La marca elegida no existe';
        }

        $estado = trim((string) ($datos['estado'] ?? ''));
        if (!in_array($estado, ['Nuevo', 'Usado'], true)) {
            return 'El estado tiene que ser Nuevo o Usado';
        }

        if (isset($datos['anio']) && $datos['anio'] !== '' && $datos['anio'] !== null) {
            if (!ctype_digit((string) $datos['anio'])) {
                return 'El año tiene que ser un número';
            }
            $anio = (int) $datos['anio'];
            if ($anio < 1950 || $anio > 2100) {
                return 'El año tiene que estar entre 1950 y 2100';
            }
        }

        if (isset($datos['precio']) && $datos['precio'] !== '' && $datos['precio'] !== null) {
            if (!is_numeric($datos['precio']) || (float) $datos['precio'] < 0) {
                return 'El precio tiene que ser un número mayor o igual a 0';
            }
        }

        return null;
    }

    private function normalizar($datos) {
        $anio = $datos['anio'] ?? null;
        $precio = $datos['precio'] ?? null;
        return [
            'id_marca' => (int) $datos['id_marca'],
            'modelo' => trim((string) $datos['modelo']),
            'anio' => ($anio === '' || $anio === null) ? null : (int) $anio,
            'precio' => ($precio === '' || $precio === null) ? null : number_format((float) $precio, 2, '.', ''),
            'estado' => $datos['estado'],
        ];
    }

    private function error($codigo, $mensaje) {
        http_response_code($codigo);
        echo json_encode([
            'status' => 'error',
            'message' => $mensaje,
        ], JSON_UNESCAPED_UNICODE);
    }
}
