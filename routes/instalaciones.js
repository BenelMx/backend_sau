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
            const sql = `SELECT nombres, apellidos, estado, ciudad, celula 
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
        const { fecha_instalacion, descripcion, observacion, fotos, costo_instalacion, Clientes_pppoe } = req.body;
        
        if (!fecha_instalacion || !descripcion || !observacion || !fotos || !costo_instalacion || !Clientes_pppoe) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        try {
            const sql = `INSERT INTO instalaciones 
            (fecha_instalacion, descripcion, observacion, fotos, costo_instalacion, Clientes_pppoe)
            VALUES (?, ?, ?, ?, ?, ?)`;
            const values = [fecha_instalacion, descripcion, observacion, fotos, costo_instalacion, Clientes_pppoe];
            const [result] = await db.query(sql, values);
            res.status(201).json({ id_instalaciones: result.insertId, ...req.body });
        } catch (err) {
            console.error('Error adding installations record:', err.message, err.stack);
            res.status(500).json({ error: 'Error adding installations record', details: err.message });
        }
    });

    // Actualizar un registro de instalaciones existente
    router.put('/:id', async (req, res) => {
        const { id } = req.params;
        const { fecha_instalacion, descripcion, observacion, fotos, Clientes_pppoe, costo_instalacion } = req.body;
    
        // Validación de entradas
        if (!fecha_instalacion || !descripcion || !observacion || !fotos || !Clientes_pppoe || !costo_instalacion) {
          return res.status(400).json({ error: 'Faltan datos requeridos' });
        }
    
        try {
          const sql = `UPDATE instalaciones SET 
            fecha_instalacion = ?, descripcion = ?, observacion = ?, fotos = ?, Clientes_pppoe = ?, costo_instalacion = ?
            WHERE id_instalaciones = ?`;
          const values = [fecha_instalacion, descripcion, observacion, fotos, Clientes_pppoe, costo_instalacion, id];
          
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
            await db.query('DELETE FROM instalaciones WHERE id_instalaciones = ?', [id]);
            res.send('Installations record deleted successfully');
        } catch (err) {
            console.error('Error deleting installations record:', err);
            res.status(500).send('Error deleting installations record');
        }
    });

    return router;
};
