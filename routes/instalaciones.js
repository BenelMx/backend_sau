// routes\instalaciones.js

const express = require('express');
const router = express.Router();
const encryption = require('../utils/encryption');


module.exports = (db, upload) => {

    // Ruta para subir múltiples fotos de instalación
    router.post('/upload', upload.array('fotos', 10), (req, res) => {
        const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
        res.status(200).json({ urls: fileUrls });
    });

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
            const sql = `SELECT nombres, apellidos, estado, ciudad, direccion, tipo_paquete FROM clientes WHERE pppoe = ?`;
            const [result] = await db.query(sql, [pppoe]);
            if (result.length > 0) {
                // Desencriptar los campos de datos sensibles antes de enviar la respuesta
                const clientData = encryption.decryptFields(result[0], [
                  'nombres', 'apellidos', 'estado', 'ciudad', 'direccion', 'tipo_paquete'
                ]);
                res.json(clientData);
            } else {
                res.status(404).send('Cliente no encontrado');
            }
        } catch (err) {
            console.error('Error fetching client data:', err);
            res.status(500).send('Error fetching client data');
        }
    });

    // Guardar una instalación con URLs de fotos
    router.post('/', async (req, res) => {
        const { fecha_instalacion, observacion, fotos, costo_instalacion, Clientes_pppoe } = req.body;

        if (!fecha_instalacion || !observacion || !fotos || !costo_instalacion || !Clientes_pppoe) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        try {
            const sql = `INSERT INTO instalaciones 
            (fecha_instalacion, observacion, fotos, costo_instalacion, Clientes_pppoe)
            VALUES (?, ?, ?, ?, ?)`;
            const values = [fecha_instalacion, observacion, JSON.stringify(fotos), costo_instalacion, Clientes_pppoe];
            const [result] = await db.query(sql, values);
            res.status(201).json({ id_instalaciones: result.insertId, ...req.body });
        } catch (err) {
            console.error('Error adding installations record:', err);
            res.status(500).json({ error: 'Error adding installations record' });
        }
    });

    // Actualizar un registro de instalaciones existente
    router.put('/:id', async (req, res) => {
        const { id } = req.params;
        const { fecha_instalacion, observacion, fotos, Clientes_pppoe, costo_instalacion } = req.body;
    
        // Validación de entradas
        if (!fecha_instalacion || !observacion || !fotos || !Clientes_pppoe || !costo_instalacion) {
          return res.status(400).json({ error: 'Faltan datos requeridos' });
        }
    
        try {
          const sql = `UPDATE instalaciones SET 
            fecha_instalacion = ?, observacion = ?, fotos = ?, Clientes_pppoe = ?, costo_instalacion = ?
            WHERE id_instalaciones = ?`;
            const values = [fecha_instalacion, observacion, JSON.stringify(fotos), Clientes_pppoe, costo_instalacion, id];
          
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

    // Obtener detalles de la instalación con fotos
    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const sql = 'SELECT * FROM instalaciones WHERE id_instalaciones = ?';
            const [result] = await db.query(sql, [id]);

            if (result.length > 0) {
                const installation = result[0];
                installation.fotos = JSON.parse(installation.fotos); // Convertir a arreglo
                res.json(installation);
            } else {
                res.status(404).send('Instalación no encontrada');
            }
        } catch (err) {
            console.error('Error fetching installation data:', err);
            res.status(500).send('Error fetching installation data');
        }
    });

    return router;
};
