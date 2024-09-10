// routes/pagos.js

const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // Obtener todos los pagos
    router.get('/', async (req, res) => {
        try {
            const [result] = await db.query('SELECT * FROM pagos');
            res.json(result);
        } catch (err) {
            console.error('Error fetching payments:', err);
            res.status(500).send('Error fetching payments');
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
            const sql = `SELECT nombres, apellidos, estado, municipio, celula, cuenta_depositar, numero_referencia 
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

    // Agregar un nuevo pago
    router.post('/', async (req, res) => {
        const { fecha_pago, monto, referencia_bancaria, descripcion, Clientes_pppoe, comprobante } = req.body;

        // Validación de entradas
        if (!Clientes_pppoe || !monto || !fecha_pago) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        try {
            const sql = `INSERT INTO pagos 
            (fecha_pago, monto, referencia_bancaria, descripcion, Clientes_pppoe, comprobante)
            VALUES (?, ?, ?, ?, ?, ?)`;
            const values = [fecha_pago, monto, referencia_bancaria, descripcion, Clientes_pppoe, comprobante];
      
            const [result] = await db.query(sql, values);
            res.status(201).json({ id: result.insertId, ...req.body });
        } catch (err) {
            console.error('Error adding payment:', err);
            res.status(500).json({ error: 'Error adding payment' });
        }
    });

    // Actualiza un pago existente
    router.put('/:id', async (req, res) => {
        const { id } = req.params;
        const { fecha_pago, monto, referencia_bancaria, descripcion, Clientes_pppoe, comprobante } = req.body;

        try {
            const sql = `UPDATE pagos SET 
            fecha_pago = ?, monto = ?, referencia_bancaria = ?, descripcion = ?, Clientes_pppoe = ?, comprobante = ?
            WHERE id_pagos = ?`;
            const values = [fecha_pago, monto, referencia_bancaria, descripcion, Clientes_pppoe, comprobante, id];
      
            await db.query(sql, values);
            res.send('Payment updated successfully');
        } catch (err) {
            console.error('Error updating payment:', err);
            res.status(500).send('Error updating payment');
        }
    });

    // Elimina un pago existente
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;

        try {
            await db.query('DELETE FROM pagos WHERE id_pagos = ?', [id]);
            res.send('Payment deleted successfully');
        } catch (err) {
            console.error('Error deleting payment:', err);
            res.status(500).send('Error deleting payment');
        }
    });

    return router;
};
