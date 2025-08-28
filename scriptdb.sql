CREATE DATABASE pedidos;

USE pedidos;

CREATE TABLE formulario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  producto VARCHAR(100) NOT NULL,
  cantidad INT NOT NULL
);
