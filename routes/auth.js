// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (db) => {
    const SECRET_KEY = process.env.SECRET_KEY || 'mi_secreto_jwt';

    router.post('/login', async (req, res) => {
        const { username, password } = req.body;
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
            if (rows.length === 0) {
                return res.status(401).json({ message: 'Usuario no encontrado' });
            }
            const user = rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }
            const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ token });
        } catch (error) {
            console.error(error);  // Muestra el error en la consola del servidor
            res.status(500).json({ message: 'Error en el servidor', error: error.message });
        }
    });
    
    return router;
};
