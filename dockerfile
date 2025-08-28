# Imagen base
FROM node:22

# Directorio de trabajo
WORKDIR /app

# Copiar archivos
COPY package*.json ./
RUN npm install

COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando de arranque
CMD ["node", "server.js"]