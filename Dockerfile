FROM node:18-alpine

WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer el puerto (ajustar según la configuración de la aplicación)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
