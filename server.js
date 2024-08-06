const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const upload = require('./multerConfig');  // Asegúrate de importar la configuración de multer

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sau'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Ruta para subir archivos
app.post('/upload', upload.single('comprobante'), (req, res) => {
  try {
    res.status(200).json({
      message: 'Archivo subido con éxito',
      filePath: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al subir el archivo' });
  }
});

// Importa las rutas de clientes y pagos
const clientesRoutes = require('./routes/clientes');
const pagosRoutes = require('./routes/pagos');  // Importa las rutas de pagos

app.use('/api/clientes', clientesRoutes);
app.use('/api/pagos', pagosRoutes);  // Usa las rutas de pagos

// Middleware para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
