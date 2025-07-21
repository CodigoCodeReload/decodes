@echo off
echo Iniciando contenedores Docker para el proyecto Pica...

REM Verificar si existe el archivo .env
if not exist .env (
    echo Creando archivo .env a partir de .env.example
    copy .env.example .env
    echo Por favor, revisa y actualiza las variables en el archivo .env según sea necesario
)

REM Construir y levantar los contenedores
echo Iniciando contenedores Docker...
docker-compose up --build -d

echo.
echo Contenedores iniciados. La aplicación está disponible en http://localhost:3000
echo Para ver los logs: docker-compose logs -f
echo Para detener los contenedores: docker-compose down
