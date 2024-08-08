// routes/clientes.js

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Obtener todos los clientes
  router.get('/', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM clientes');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving clients' });
    }
  });

  // Obtener un cliente específico por PPPoE
  router.get('/:pppoe', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM clientes WHERE pppoe = ?', [req.params.pppoe]);
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).json({ error: 'Client not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving client' });
    }
  });

  // Crear un nuevo cliente
  router.post('/', async (req, res) => {
    const { pppoe, nombres, apellidos, ciudad, direccion, estado, telefono, email, fecha_registro, fecha_corte, tipo_paquete, monto_mensual, extras, observaciones, status } = req.body;
    try {
      await db.query(
        'INSERT INTO clientes (pppoe, nombres, apellidos, ciudad, direccion, estado, telefono, email, fecha_registro, fecha_corte, tipo_paquete, monto_mensual, extras, observaciones, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [pppoe, nombres, apellidos, ciudad, direccion, estado, telefono, email, fecha_registro, fecha_corte, tipo_paquete, monto_mensual, extras, observaciones, status]
      );
      res.status(201).json({ message: 'Client created' });
    } catch (error) {
      res.status(500).json({ error: 'Error creating client' });
    }
  });

  // Actualizar un cliente existente
  router.put('/:pppoe', async (req, res) => {
    const { pppoe } = req.params;
    const { nombres, apellidos, ciudad, direccion, estado, telefono, email, fecha_registro, fecha_corte, tipo_paquete, monto_mensual, extras, observaciones, status } = req.body;
    try {
      await db.query(
        'UPDATE clientes SET nombres = ?, apellidos = ?, ciudad = ?, direccion = ?, estado = ?, telefono = ?, email = ?, fecha_registro = ?, fecha_corte = ?, tipo_paquete = ?, monto_mensual = ?, extras = ?, observaciones = ?, status = ? WHERE pppoe = ?',
        [nombres, apellidos, ciudad, direccion, estado, telefono, email, fecha_registro, fecha_corte, tipo_paquete, monto_mensual, extras, observaciones, status, pppoe]
      );
      res.json({ message: 'Client updated' });
    } catch (error) {
      res.status(500).json({ error: 'Error updating client' });
    }
  });

  // Eliminar un cliente
  router.delete('/:pppoe', async (req, res) => {
    try {
      await db.query('DELETE FROM clientes WHERE pppoe = ?', [req.params.pppoe]);
      res.json({ message: 'Client deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting client' });
    }
  });

  return router;
};
