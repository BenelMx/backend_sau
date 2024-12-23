// routes/clientes.js

const express = require('express');
const router = express.Router();

module.exports = (db, encryption, ENCRYPTED_FIELDS) => {

    // Middleware to decrypt response data
    const decryptResponse = (req, res, next) => {
        const originalJson = res.json;
        res.json = function(data) {
            if (Array.isArray(data)) {
                data = data.map(item => encryption.decryptFields(item, ENCRYPTED_FIELDS));
            } else if (data && typeof data === 'object') {
                data = encryption.decryptFields(data, ENCRYPTED_FIELDS);
            }
            return originalJson.call(this, data);
        };
        next();
    };

    router.use(decryptResponse);

    // Obtener las células únicas de los clientes
    router.get('/celulas', async (req, res) => {
        try {
            const [rows] = await db.query('SELECT DISTINCT celula FROM clientes');
            if (rows.length > 0) {
                res.json(rows.map(row => row.celula));
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
            const [rows] = await db.query('SELECT DISTINCT status FROM clientes');
            if (rows.length > 0) {
                res.json(rows.map(row => row.status));
            } else {
                res.status(404).json({ error: 'No cells found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving cells' });
        }
    });

    // Obtener los estados únicos de los clientes
    router.get('/estado', async (req, res) => {
        try {
            const [rows] = await db.query('SELECT DISTINCT estado FROM clientes');
            if (rows.length > 0) {
                res.json(rows.map(row => row.estado));
            } else {
                res.status(404).json({ error: 'No cells found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving cells' });
        }
    });

    // Obtener las ciudades/municipios únicos de los clientes
    router.get('/ciudad', async (req, res) => {
        try {
            const [rows] = await db.query('SELECT DISTINCT ciudad FROM clientes');
            if (rows.length > 0) {
                res.json(rows.map(row => row.ciudad));
            } else {
                res.status(404).json({ error: 'No cells found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving cells' });
        }
    });

    // Obtener los pppoe únicas de los clientes
    router.get('/pppoe', async (req, res) => {
        try {
            const [rows] = await db.query('SELECT DISTINCT pppoe FROM clientes');
            if (rows.length > 0) {
                res.json(rows.map(row => row.pppoe));
            } else {
                res.status(404).json({ error: 'No cells found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving cells' });
        }
    });

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

    // Crea un nuevo cliente
    router.post('/', async (req, res) => {
        const clientData = encryption.encryptFields(req.body, ENCRYPTED_FIELDS);
        try {
            const fields = Object.keys(clientData).join(', ');
            const placeholders = Object.keys(clientData).map(() => '?').join(', ');
            const values = Object.values(clientData);

            await db.query(
                `INSERT INTO clientes (${fields}) VALUES (${placeholders})`,
                values
            );
            res.status(201).json({ message: 'Client created' });
        } catch (error) {
            res.status(500).json({ error: 'Error creating client' });
        }
    });

    // Actualiza un cliente existente
    router.put('/:pppoe', async (req, res) => {
        const clientData = encryption.encryptFields(req.body, ENCRYPTED_FIELDS);
        try {
            const setClause = Object.keys(clientData)
                .map(key => `${key} = ?`)
                .join(', ');
            const values = [...Object.values(clientData), req.params.pppoe];

            await db.query(
                `UPDATE clientes SET ${setClause} WHERE pppoe = ?`,
                values
            );
            res.json({ message: 'Client updated' });
        } catch (error) {
            res.status(500).json({ error: 'Error updating client' });
        }
    });

    // Elimina un cliente
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
