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

  // Obtener los niveles únicos de los clientes
  router.get('/nivel', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT DISTINCT nivel_soporte FROM soporte');
        if (rows.length > 0) {
            res.json(rows.map(row => row.nivel_soporte));
        } else {
            res.status(404).json({ error: 'No cells found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving cells' });
    }
  });

  // Obtener los status únicos de los clientes
  router.get('/status', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT DISTINCT status FROM soporte');
        if (rows.length > 0) {
            res.json(rows.map(row => row.status));
        } else {
            res.status(404).json({ error: 'No cells found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving cells' });
    }
  });

  // Obtener PPPoE filtrados desde la tabla clientes
  router.get('/pppoe', async (req, res) => {
    const searchTerm = req.query.search || '';

    try {
        const sql = `SELECT DISTINCT pppoe FROM clientes 
                     WHERE pppoe LIKE ?`;
        const [result] = await db.query(sql, [`%${searchTerm}%`]);

        const pppoeList = result.map(row => row.pppoe);
        res.json(pppoeList);
    } catch (err) {
        console.error('Error fetching filtered PPPoE:', err);
        res.status(500).send('Error fetching filtered PPPoE');
    }
  });

  // Obtener datos del cliente basado en PPPoE
  router.get('/cliente/:pppoe', async (req, res) => {
    const { pppoe } = req.params;

    try {
        const sql = `SELECT nombres, apellidos, telefono, estado, ciudad, celula 
                     FROM clientes 
                     WHERE pppoe = ?`;
        const [result] = await db.query(sql, [pppoe]);

        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).send('Cliente no encontrado');
        }
    } catch (err) {
        console.error('Error fetching client data:', err);
        res.status(500).send('Error fetching client data');
    }
});

  // Agregar un nuevo registro de soporte
  router.post('/', async (req, res) => {
    const { fecha_reporte, descripcion, status, Clientes_pppoe, nivel_soporte } = req.body;

    // Validación de entradas
    if (!fecha_reporte || !descripcion || !status || !Clientes_pppoe || !nivel_soporte) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
      const sql = `INSERT INTO soporte 
        (fecha_reporte, descripcion, status, Clientes_pppoe, nivel_soporte)
        VALUES (?, ?, ?, ?, ?)`;
      const values = [fecha_reporte, descripcion, status, Clientes_pppoe, nivel_soporte];
      
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
    const { fecha_reporte, descripcion, status, Clientes_pppoe, nivel_soporte } = req.body;

    // Validación de entradas
    if (!fecha_reporte || !descripcion || !status || !Clientes_pppoe || !nivel_soporte) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
      const sql = `UPDATE soporte SET 
        fecha_reporte = ?, descripcion = ?, status = ?, Clientes_pppoe = ?, nivel_soporte = ?
        WHERE id_soporte = ?`;
      const values = [fecha_reporte, descripcion, status, Clientes_pppoe, nivel_soporte, id];
      
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
