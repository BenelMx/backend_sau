// routes\clientes.js

const express = require('express');
const router = express.Router();

module.exports = (db) => {

  // Obtener todos los clientes
  router.get('/', async (req, res) => {
    try {
      const [result] = await db.query('SELECT * FROM clientes');
      res.json(result);
    } catch (err) {
      console.error('Error fetching clients:', err);
      res.status(500).send('Error fetching clients');
    }
  });

  // Agregar un nuevo cliente
  router.post('/', async (req, res) => {
    const { pppoe, nombres, apellidos, ciudad, estado, telefono, email, fecha_registro, fecha_corte, tipo_paquete, monto_mensual, extras, observaciones, status } = req.body;

    // Validación de entradas
    if (!pppoe || !nombres || !apellidos || !estado) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
      const sql = `INSERT INTO clientes 
        (pppoe, nombres, apellidos, ciudad, estado, telefono, email, fecha_registro, fecha_corte, tipo_paquete, monto_mensual, extras, observaciones, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [pppoe, nombres, apellidos, ciudad, estado, telefono, email, fecha_registro, fecha_corte, tipo_paquete, monto_mensual, extras, observaciones, status];
      
      const [result] = await db.query(sql, values);
      res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
      console.error('Error adding client:', err);
      res.status(500).json({ error: 'Error adding client' });
    }
  });

  // Actualizar un cliente existente
  router.put('/:pppoe', async (req, res) => {
    const { pppoe } = req.params;
    const { nombres, apellidos, ciudad, estado, telefono, email, fecha_registro, fecha_corte, tipo_paquete, monto_mensual, extras, observaciones, status } = req.body;

    try {
      const sql = `UPDATE clientes SET 
        nombres = ?, apellidos = ?, ciudad = ?, estado = ?, telefono = ?, email = ?, fecha_registro = ?, fecha_corte = ?, tipo_paquete = ?, monto_mensual = ?, extras = ?, observaciones = ?, status = ? 
        WHERE pppoe = ?`;
      const values = [nombres, apellidos, ciudad, estado, telefono, email, fecha_registro, fecha_corte, tipo_paquete, monto_mensual, extras, observaciones, status, pppoe];
      
      await db.query(sql, values);
      res.send('Client updated successfully');
    } catch (err) {
      console.error('Error updating client:', err);
      res.status(500).send('Error updating client');
    }
  });

  // Eliminar un cliente existente
  router.delete('/:pppoe', async (req, res) => {
    const { pppoe } = req.params;

    try {
      await db.query('DELETE FROM clientes WHERE pppoe = ?', [pppoe]);
      res.send('Client deleted successfully');
    } catch (err) {
      console.error('Error deleting client:', err);
      res.status(500).send('Error deleting client');
    }
  });

  return router;
};
