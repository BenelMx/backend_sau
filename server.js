// server.js

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const encryption = require('./utils/encryption');

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

// Fields to encrypt in the database
const ENCRYPTED_FIELDS = [
    'nombres',
    'apellidos',
    'direccion',
    'telefono',
    'email',
    'observaciones',
    'cuenta_depositar',
    'numero_referencia'
];
const ENCRYPTED_FIELDS_PAGOS = [
    'referencia_bancaria'
];

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

        const clientesRoutes = require('./routes/clientes')(db, encryption, ENCRYPTED_FIELDS);
        const pagosRoutes = require('./routes/pagos')(db, upload, encryption, ENCRYPTED_FIELDS_PAGOS);
        const authRoutes = require('./routes/auth')(db);
        const soporteRoutes = require('./routes/soporte')(db);
        const instalacionesRoutes = require('./routes/instalaciones')(db, upload);

        app.use('/api/clientes', clientesRoutes);
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
