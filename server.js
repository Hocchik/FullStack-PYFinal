const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const PORT = 3000;

// Configuración de conexión a SQL Server
const dbConfig = {
  user: 'UsuarioA',
  password: 'papaya',
  server: 'localhost',
  database: 'pedidos',
  options: {
    encrypt: false,
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
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('nombre_cliente', sql.VarChar(100), nombre)
      .input('producto', sql.VarChar(100), producto)
      .input('cantidad', sql.Int, parseInt(cantidad))
      .query(`
        INSERT INTO formulario (nombre_cliente, producto, cantidad)
        VALUES (@nombre_cliente, @producto, @cantidad)
      `);

    // Respuesta JSON para el modal
    res.status(200).json({
      mensaje: `Pedido registrado: ${nombre} solicitó ${cantidad} unidad(es) de ${producto}.`
    });
  } catch (err) {
    console.error('❌ Error al insertar en SQL Server:', err);
    res.status(500).json({ error: 'Error interno al registrar el pedido' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});