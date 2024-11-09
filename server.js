// server.js

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db;

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

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

        const clientesRoutes = require('./routes/clientes')(db);
        const pagosRoutes = require('./routes/pagos')(db, upload);
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
