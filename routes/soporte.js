// routes\soporte.js

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Obtener todos los registros de soporte
  router.get('/', async (req, res) => {
    try {
      const [result] = await db.query('SELECT * FROM soporte');
      res.json(result);
    } catch (err) {
      console.error('Error fetching support records:', err);
      res.status(500).send('Error fetching support records');
    }
  });

  // Agregar un nuevo registro de soporte
  router.post('/', async (req, res) => {
    const { fecha_reporte, descripcion, status, Clientes_pppoe } = req.body;

    // Validación de entradas
    if (!fecha_reporte || !descripcion || !status || !Clientes_pppoe) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
      const sql = `INSERT INTO soporte 
        (fecha_reporte, descripcion, status, Clientes_pppoe)
        VALUES (?, ?, ?, ?)`;
      const values = [fecha_reporte, descripcion, status, Clientes_pppoe];
      
      const [result] = await db.query(sql, values);
      res.status(201).json({ id_soporte: result.insertId, ...req.body });
    } catch (err) {
      console.error('Error adding support record:', err);
      res.status(500).json({ error: 'Error adding support record' });
    }
  });

  // Actualizar un registro de soporte existente
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { fecha_reporte, descripcion, status, Clientes_pppoe } = req.body;

    // Validación de entradas
    if (!fecha_reporte || !descripcion || !status || !Clientes_pppoe) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
      const sql = `UPDATE soporte SET 
        fecha_reporte = ?, descripcion = ?, status = ?, Clientes_pppoe = ?
        WHERE id_soporte = ?`;
      const values = [fecha_reporte, descripcion, status, Clientes_pppoe, id];
      
      await db.query(sql, values);
      res.send('Support record updated successfully');
    } catch (err) {
      console.error('Error updating support record:', err);
      res.status(500).send('Error updating support record');
    }
  });

  // Eliminar un registro de soporte existente
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      await db.query('DELETE FROM soporte WHERE id_soporte = ?', [id]);
      res.send('Support record deleted successfully');
    } catch (err) {
      console.error('Error deleting support record:', err);
      res.status(500).send('Error deleting support record');
    }
  });

  return router;
};
