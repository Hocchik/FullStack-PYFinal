const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const PORT = 3000;

// Configuración de conexión a SQL Server
const dbConfig = {
  user: 'UsuarioA',           // ← Ajusta según tu configuración
  password: 'papaya',
  server: 'localhost',        // o IP del servidor
  database: 'pedidos',
  options: {
    encrypt: false,           // true si usas Azure
    trustServerCertificate: true
  }
};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'web')));

// Ruta para manejar el formulario
app.post('/submit', async (req, res) => {
  const { nombre, producto, cantidad } = req.body;

  // Validación defensiva
  if (!nombre || !producto || !cantidad || isNaN(cantidad)) {
    return res.status(400).send('Datos inválidos');
  }

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('nombre_cliente', sql.VarChar(100), nombre)
      .input('producto', sql.VarChar(100), producto)
      .input('cantidad', sql.Int, parseInt(cantidad))
      .query(`
        INSERT INTO formulario (nombre_cliente, producto, cantidad)
        VALUES (@nombre_cliente, @producto, @cantidad)
      `);

    res.send(`Pedido registrado: ${nombre} solicitó ${cantidad} unidad(es) de ${producto}.`);
  } catch (err) {
    console.error('Error al insertar en SQL Server:', err);
    res.status(500).send('Error interno');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});