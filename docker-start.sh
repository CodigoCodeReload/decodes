#!/bin/bash

# Asegurarse de que el archivo .env existe
if [ ! -f .env ]; then
  echo "Creando archivo .env a partir de .env.example"
  cp .env.example .env
  echo "Por favor, revisa y actualiza las variables en el archivo .env según sea necesario"
fi

# Construir y levantar los contenedores
echo "Iniciando contenedores Docker..."
docker-compose up --build -d

echo "Contenedores iniciados. La aplicación está disponible en http://localhost:3000"
echo "Para ver los logs: docker-compose logs -f"
echo "Para detener los contenedores: docker-compose down"
