CREATE DATABASE pedidos;

USE pedidos;

CREATE TABLE formulario (
  id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
  nombre_cliente VARCHAR(100) NOT NULL,
  producto VARCHAR(100) NOT NULL,
  cantidad INT NOT NULL
);
