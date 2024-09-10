// server.js

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3006;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db;

async function initializeDbConnection() {
    try {
        db = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            connectionLimit: 10
        });
        console.log('Connected to the database');

        const clientesRoutes = require('./routes/clientes')(db);
        const pagosRoutes = require('./routes/pagos')(db);
        const authRoutes = require('./routes/auth')(db);

        app.use('/api/clientes', clientesRoutes);
        app.use('/api/pagos', pagosRoutes);
        app.use('/api/auth', authRoutes); // Aquí estás configurando la ruta de autenticación
        app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

initializeDbConnection();
