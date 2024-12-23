// routes/auth.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

module.exports = (db) => {

    router.post('/login', async (req, res) => {
        const { username, password } = req.body;

        try {
            const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const user = rows[0];
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token });
        } catch (err) {
            res.status(500).json({ message: 'Error en el servidor' });
        }
    });
    
    return router;
};
