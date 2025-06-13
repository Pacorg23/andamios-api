# Usamos una imagen oficial de Node.js
FROM node:18-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Aseguramos que el script de espera sea ejecutable
RUN chmod +x ./wait-for-bd.sh

# Puerto en el que corre la app
EXPOSE 3000

# Comando para esperar a MariaDB y luego arrancar la app
#CMD ["sh", "./wait-for-bd.sh", "db:3306", "npm", "start"]
CMD ["sh", "./wait-for-bd.sh", "localhost:3306", "npm", "start"]


