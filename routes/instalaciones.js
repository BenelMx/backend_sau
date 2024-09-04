// routes\instalaciones.js

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Obtener todos los registros de instalaciones
  router.get('/', async (req, res) => {
    try {
      const [result] = await db.query('SELECT * FROM instalaciones');
      res.json(result);
    } catch (err) {
      console.error('Error fetching installations records:', err);
      res.status(500).send('Error fetching installations records');
    }
  });

  // Agregar un nuevo registro de soporte
  router.post('/', async (req, res) => {
    const { fecha_instalación, descripcion, observación, fotos, costo_instalacion, status, Clientes_ppoe } = req.body;

    // Validación de entradas
    if (!fecha_instalación || !descripcion || !observación || !fotos || !costo_instalacion || !status || !Clientes_ppoe) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
      const sql = `INSERT INTO instalaciones 
        (fecha_instalación, descripcion, observación, fotos, costo_instalacion, status, Clientes_ppoe)
        VALUES (?, ?, ?, ?)`;
      const values = [fecha_instalación, descripcion, observación, fotos, costo_instalacion, status, Clientes_ppoe];
      
      const [result] = await db.query(sql, values);
      res.status(201).json({ id_instalaciones: result.insertId, ...req.body });
    } catch (err) {
      console.error('Error adding installations record:', err);
      res.status(500).json({ error: 'Error adding installations record' });
    }
  });

  // Actualizar un registro de instalaciones existentes
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { fecha_instalación, descripcion, observación, fotos, costo_instalacion, status, Clientes_ppoe } = req.body;

    // Validación de entradas
    if (!fecha_instalación || !descripcion || !observación || !fotos || !costo_instalacion || !status || !Clientes_ppoe) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
      const sql = `UPDATE instalaciones SET 
        fecha_instalación = ?, descripcion = ?, observación = ?, fotos, costo_instalacion = ?, status = ?, Clientes_ppoe = ? = ?
        WHERE id_instalaciones = ?`;
      const values = [fecha_instalación, descripcion, observación, fotos, costo_instalacion, status, Clientes_ppoe, id];
      
      await db.query(sql, values);
      res.send('Installations record updated successfully');
    } catch (err) {
      console.error('Error updating installations record:', err);
      res.status(500).send('Error updating installations record');
    }
  });

  // Eliminar un registro de soporte existente
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      await db.query('DELETE FROM instalaciones WHERE id_instalaciones = ?', [id]);
      res.send('Installations record deleted successfully');
    } catch (err) {
      console.error('Error deleting installations record:', err);
      res.status(500).send('Error deleting installations record');
    }
  });

  return router;
};
