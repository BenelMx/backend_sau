const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre del archivo
  }
});

const upload = multer({ storage });

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

// Obteniendo todos los pagos en el backend
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM Pagos';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching payments:', err);
      return res.status(500).send('Error fetching payments');
    }
    res.json(result);
  });
});

// Agregar un nuevo pago
router.post('/', upload.single('comprobante'), (req, res) => {
  const { fecha_pago, monto, referencia_bancaria, descripcion, Clientes_pppoe } = req.body;
  const comprobante = req.file ? req.file.path : null; // Ruta del archivo cargado

  const sql = 'INSERT INTO Pagos (fecha_pago, monto, referencia_bancaria, descripcion, Clientes_pppoe, comprobante) VALUES (?, ?, ?, ?, ?, ?)';

  const values = [fecha_pago, monto, referencia_bancaria, descripcion, Clientes_pppoe, comprobante];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error adding payment:', err);
      return res.status(500).json({ error: 'Error adding payment' });
    }
    res.status(201).json({
      fecha_pago, monto, referencia_bancaria, descripcion, Clientes_pppoe, comprobante
    });
  });
});

// Actualizar un pago existente
router.put('/:id_pagos', upload.single('comprobante'), (req, res) => {
  const { id_pagos } = req.params;
  const { fecha_pago, monto, referencia_bancaria, descripcion, Clientes_pppoe } = req.body;
  const comprobante = req.file ? req.file.path : null; // Ruta del archivo cargado

  const sql = 'UPDATE Pagos SET fecha_pago = ?, monto = ?, referencia_bancaria = ?, descripcion = ?, Clientes_pppoe = ?, comprobante = ? WHERE id_pagos = ?';

  const values = [fecha_pago, monto, referencia_bancaria, descripcion, Clientes_pppoe, comprobante, id_pagos];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating payment:', err);
      return res.status(500).send('Error updating payment');
    }
    res.send('Payment updated successfully');
  });
});

// Eliminar un pago existente
router.delete('/:id_pagos', (req, res) => {
  const { id_pagos } = req.params;

  const sql = 'DELETE FROM Pagos WHERE id_pagos = ?';

  db.query(sql, [id_pagos], (err, result) => {
    if (err) {
      console.error('Error deleting payment:', err);
      return res.status(500).send('Error deleting payment');
    }
    res.send('Payment deleted successfully');
  });
});

// Obtener todos los PPPoE disponibles desde la tabla 'clientes'
router.get('/pppoe', (req, res) => {
  const sql = 'SELECT pppoe FROM clientes';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching PPPoE:', err);
      return res.status(500).send('Error fetching PPPoE');
    }
    // Devuelve solo un array de pppoe
    const pppoeList = result.map(row => row.pppoe);
    res.json(pppoeList);
  });
});

module.exports = router;
