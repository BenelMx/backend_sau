// routes/pagos.js

const express = require('express');
const router = express.Router();

module.exports = (db, upload) => {
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
            const sql = `SELECT DISTINCT pppoe FROM clientes WHERE pppoe LIKE ?`;
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
            const sql = `SELECT nombres, apellidos, estado, ciudad, celula, cuenta_depositar, numero_referencia 
                         FROM clientes WHERE pppoe = ?`;
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

    // Agregar un nuevo pago con archivo
    router.post('/', upload.single('comprobante'), async (req, res) => {
        const { fecha_pago, monto, referencia_bancaria, descripcion, Clientes_pppoe } = req.body;

        if (!fecha_pago || !monto || !Clientes_pppoe) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        try {
            const [result] = await db.query(
                'INSERT INTO pagos (fecha_pago, monto, referencia_bancaria, descripcion, Clientes_pppoe, comprobante) VALUES (?, ?, ?, ?, ?, ?)',
                [fecha_pago, monto, referencia_bancaria, descripcion, Clientes_pppoe, req.file ? req.file.filename : null]
            );
            res.status(201).json({ message: 'Pago agregado', id: result.insertId });
        } catch (error) {
            console.error('Error adding payment:', error);
            res.status(500).json({ error: 'Error adding payment' });
        }
    });

    // Actualizar un pago existente
    router.put('/:id', upload.single('comprobante'), async (req, res) => {
        const { id } = req.params;
        const { fecha_pago, monto, referencia_bancaria, descripcion, Clientes_pppoe } = req.body;
        const comprobante = req.file ? req.file.filename : req.body.comprobante;

        try {
            const sql = `UPDATE pagos SET fecha_pago = ?, monto = ?, referencia_bancaria = ?, descripcion = ?, Clientes_pppoe = ?, comprobante = ? WHERE id_pagos = ?`;
            const values = [fecha_pago, monto, referencia_bancaria, descripcion, Clientes_pppoe, comprobante, id];

            await db.query(sql, values);
            res.send('Payment updated successfully');
        } catch (err) {
            console.error('Error updating payment:', err);
            res.status(500).send('Error updating payment');
        }
    });

    // Eliminar un pago existente
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
