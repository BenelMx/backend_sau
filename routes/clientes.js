const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sau'
});

// Conectar a la base de datos
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Obtener todos los clientes
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM Clientes';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching clients:', err);
      return res.status(500).send('Error fetching clients');
    }
    res.json(result);
  });
});

// Agregar un nuevo cliente
router.post('/', (req, res) => {
  const { pppoe, nombres, apellidos, ciudad, estado, telefono, email, fecha_registro, fecha_corte, tipo_paquete, monto_mensual, extras, observaciones, status } = req.body;

  const sql = 'INSERT INTO Clientes (pppoe, nombres, apellidos, ciudad, estado, telefono, email, fecha_registro, fecha_corte, tipo_paquete, monto_mensual, extras, observaciones, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  const values = [pppoe, nombres, apellidos, ciudad, estado, telefono, email, fecha_registro, fecha_corte, tipo_paquete, monto_mensual, extras, observaciones, status];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error adding client:', err);
      return res.status(500).json({ error: 'Error adding client' });
    }
    res.status(201).json({
      pppoe, nombres, apellidos, ciudad, estado, telefono, email, fecha_registro, fecha_corte, tipo_paquete, monto_mensual, extras, observaciones, status
    });
  });
});

// Actualizar un cliente existente
router.put('/:pppoe', (req, res) => {
  const { pppoe } = req.params;
  const { nombres, apellidos, ciudad, estado, telefono, email, fecha_registro, fecha_corte, tipo_paquete, monto_mensual, extras, observaciones, status } = req.body;

  const sql = 'UPDATE Clientes SET nombres = ?, apellidos = ?, ciudad = ?, estado = ?, telefono = ?, email = ?, fecha_registro = ?, fecha_corte = ?, tipo_paquete = ?, monto_mensual = ?, extras = ?, observaciones = ?, status = ? WHERE pppoe = ?';

  const values = [nombres, apellidos, ciudad, estado, telefono, email, fecha_registro, fecha_corte, tipo_paquete, monto_mensual, extras, observaciones, status, pppoe];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating client:', err);
      return res.status(500).send('Error updating client');
    }
    res.send('Client updated successfully');
  });
});

// Eliminar un cliente existente
router.delete('/:pppoe', (req, res) => {
  const { pppoe } = req.params;

  const sql = 'DELETE FROM Clientes WHERE pppoe = ?';

  db.query(sql, [pppoe], (err, result) => {
    if (err) {
      console.error('Error deleting client:', err);
      return res.status(500).send('Error deleting client');
    }
    res.send('Client deleted successfully');
  });
});

module.exports = router;
