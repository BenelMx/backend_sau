// server.js

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3001;
/*
const corsOptions = {
    origin: ['https://lincestelecom.mx/'], // Orígenes permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};
app.use(cors(corsOptions)); */
app.use(cors()); // eliminar esta linea luego y probar si sirve el cors
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

let db;

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// Middleware para validar JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token requerido' });

    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.user = user;
        next();
    });
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido'));
        }
    }
});

async function initializeDbConnection() {
    try {
        db = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            connectionLimit: 20
        });
        console.log('Connected to the database');

        const clientesRoutes = require('./routes/clientes')(db, authenticateToken);
        const pagosRoutes = require('./routes/pagos')(db, upload);
        const authRoutes = require('./routes/auth')(db);
        const soporteRoutes = require('./routes/soporte')(db);
        const instalacionesRoutes = require('./routes/instalaciones')(db, upload);

        app.use('/api/clientes', authenticateToken, clientesRoutes);
        app.use('/api/pagos', pagosRoutes);
        app.use('/api/soporte',soporteRoutes);
        app.use('/api/instalaciones', instalacionesRoutes);
        app.use('/api/auth', authRoutes);
        app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
        
        app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

initializeDbConnection();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: 'Algo salió mal, por favor intente más tarde.' });
});
