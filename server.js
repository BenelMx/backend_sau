const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');  // Asegúrate de instalar body-parser

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());  // Usa bodyParser.json() para analizar JSON
app.use(bodyParser.urlencoded({ extended: true }));  // Usa bodyParser.urlencoded() si recibes datos codificados en URL

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

const clientesRoutes = require('./routes/clientes');
app.use('/api/clientes', clientesRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
