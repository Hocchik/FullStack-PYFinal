const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'UsuarioA',       // ← Ajusta según tu configuración
  password: 'papaya',
  database: 'pedidos'
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión a MySQL:', err);
    process.exit(1);
  }
  console.log('Conectado a MySQL');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'web')));

// Ruta para manejar el formulario
app.post('/submit', (req, res) => {
  const { nombre, producto, cantidad } = req.body;

  // Validación básica
  if (!nombre || !producto || !cantidad || isNaN(cantidad)) {
    return res.status(400).send('Datos inválidos');
  }

  const query = 'INSERT INTO formulario (nombre, producto, cantidad) VALUES (?, ?, ?)';
  db.query(query, [nombre, producto, cantidad], (err, result) => {
    if (err) {
      console.error('Error al insertar en la BD:', err);
      return res.status(500).send('Error interno');
    }

    res.send(`Pedido registrado: ${nombre} solicitó ${cantidad} unidad(es) de ${producto}.`);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});