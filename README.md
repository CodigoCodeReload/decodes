# Game Timer System

A precision-based game timer system where users try to stop a timer exactly 10 seconds after starting it.

## Características Principales

- **Arquitectura Hexagonal**: Separación clara entre dominio, aplicación e infraestructura
- **Autenticación JWT**: Sistema de autenticación basado en tokens JWT
- **Pruebas Unitarias**: Cobertura de pruebas para servicios y middleware críticos
- **Dockerización**: Configuración completa para desarrollo y despliegue con Docker

## Hexagonal Architecture

This project implements the Hexagonal Architecture (Ports and Adapters) pattern to achieve a clean separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                      REST API Controllers                       │
└───────────────────────────────┬───────────────────────────────┬─┘
                                │                               │
                                ▼                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Input Ports (Use Cases)                  │
│                                                                 │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────┐│
│  │                 │     │                 │     │             ││
│  │  Authentication │     │  Game Session   │     │ Leaderboard ││
│  │     Service     │◄────►     Service     │◄────►   Service   ││
│  │                 │     │                 │     │             ││
│  └────────┬────────┘     └────────┬────────┘     └──────┬──────┘│
└───────────┼────────────────────────┼────────────────────┼───────┘
            │                        │                    │
            ▼                        ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Output Ports                             │
│                                                                 │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────┐│
│  │                 │     │                 │     │             ││
│  │     User        │     │  Game Session   │     │ Game Result ││
│  │   Repository    │     │   Repository    │     │ Repository  ││
│  │                 │     │                 │     │             ││
│  └────────┬────────┘     └────────┬────────┘     └──────┬──────┘│
└───────────┼────────────────────────┼────────────────────┼───────┘
            │                        │                    │
            ▼                        ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Infrastructure Adapters                    │
│                                                                 │
│                       In-Memory Data Store                      │
└─────────────────────────────────────────────────────────────────┘
```

### Hexagonal Architecture Layers

1. **Domain Layer**:
   - Core business entities: `User`, `GameSession`, `GameResult`, `LeaderboardEntry`
   - Domain services: `GameService` para la lógica central del juego y puntuación
   - Lógica de negocio pura sin dependencias de frameworks externos
   - Implementa las reglas de negocio fundamentales del sistema

2. **Application Layer**:
   - Casos de uso y servicios de aplicación: `AuthService`, `GameApplicationService`, `LeaderboardService`
   - Orquesta objetos de dominio para cumplir requisitos de negocio
   - Depende de la capa de dominio y puertos (interfaces)
   - Implementa la lógica de aplicación manteniendo la independencia del dominio

3. **Ports Layer**:
   - Puertos de entrada (primarios): Interfaces para casos de uso (lo que la aplicación hace)
     - Ejemplos: `TokenService`, interfaces de controladores
   - Puertos de salida (secundarios): Interfaces para servicios de infraestructura (lo que la aplicación necesita)
     - Ejemplos: Interfaces de repositorios para `User`, `GameSession`, `GameResult`
   - Define contratos claros entre las diferentes capas

4. **Adapters Layer**:
   - Adaptadores primarios: Controladores REST, endpoints API
     - Ejemplos: `ExpressAuthController`, `ExpressGameController`, `AuthMiddleware`
   - Adaptadores secundarios: Repositorios, servicios externos
     - Ejemplos: `InMemoryUserRepository`, `JwtTokenService`
   - Implementa interfaces de puertos para conectar con sistemas externos
   - Permite reemplazar implementaciones sin afectar el núcleo de la aplicación

5. **Infrastructure Layer**:
   - Configuración, arranque, inyección de dependencias
   - Código específico del framework (Express)
   - Utilidades:
     - Manejo de errores (`ErrorTypes`, `ErrorMiddleware`)
     - Validación (`ValidationService`)
     - Configuración (`AppConfig`)
   - Proporciona servicios técnicos al resto de la aplicación

## Pruebas Unitarias

El proyecto incluye pruebas unitarias para componentes críticos, siguiendo los principios de la arquitectura hexagonal para garantizar que cada capa se pruebe de forma aislada.

### Estructura de Pruebas

Las pruebas se organizan en la carpeta `src/__tests__` y siguen una estructura que refleja la arquitectura hexagonal:

```
src/
└── __tests__/
    ├── JwtTokenService.test.ts  # Pruebas para el adaptador de tokens JWT
    ├── AuthMiddleware.test.ts    # Pruebas para el middleware de autenticación
    └── types.ts                  # Tipos compartidos para las pruebas
```

### Componentes Probados

1. **JwtTokenService**
   - Pruebas para `generateToken`: Verifica la generación correcta de tokens JWT
   - Pruebas para `generateSessionToken`: Verifica la generación de tokens de sesión
   - Pruebas para `verifyToken`: Verifica la validación y decodificación de tokens

2. **AuthMiddleware**
   - Pruebas para `authenticate`: Verifica el proceso de autenticación con tokens
   - Pruebas para `authorizeUser`: Verifica la autorización basada en roles y permisos

### Ejecución de Pruebas

Para ejecutar las pruebas unitarias:

```bash
npm test
```

Para ejecutar las pruebas con cobertura:

```bash
npm run test:coverage
```

## Dockerización

El proyecto está completamente dockerizado para facilitar el desarrollo y despliegue, manteniendo la consistencia entre entornos.

### Estructura de Docker

- **Dockerfile**: Define la imagen base para la aplicación
- **docker-compose.yml**: Configura los servicios necesarios (aplicación y MongoDB)
- **docker-start.sh/bat**: Scripts para iniciar fácilmente los contenedores

### Servicios Configurados

1. **Aplicación (app)**
   - Basada en Node.js 18 Alpine para un tamaño reducido
   - Configurada para desarrollo con hot-reload
   - Expone el puerto 3000 para acceso web

2. **Base de Datos (mongodb)**
   - MongoDB para persistencia de datos
   - Volumen para mantener los datos entre reinicios
   - Configuración inicial para la base de datos

### Variables de Entorno

Las variables de entorno se gestionan a través del archivo `.env` (generado a partir de `.env.example`):

- Variables para JWT (secreto, tiempo de expiración)
- Configuración de MongoDB (URI, nombre de base de datos)
- Configuración del servidor (puerto, entorno)

### Redes y Volúmenes

- Red `pica-network` para comunicación entre contenedores
- Volumen `mongodb_data` para persistencia de datos

## Technical Stack

### Core Technologies
- **Backend**: Node.js, TypeScript, Express
- **Architecture**: Hexagonal (Ports and Adapters)
- **Authentication**: JWT tokens
- **Data Storage**: In-memory (Maps) con opción de MongoDB

### Desarrollo y Pruebas
- **Testing**: Jest, ts-jest para pruebas unitarias
- **Mocking**: Jest mocks para simular dependencias externas
- **Validación**: Sistema de validación personalizado

### Infraestructura y Despliegue
- **Contenedores**: Docker, Docker Compose
- **Base de Datos**: MongoDB (configurada en Docker)
- **Entorno**: Configuración mediante variables de entorno

### Documentación
- **API**: Postman collection (incluida)
- **Código**: Comentarios y tipos TypeScript
- **Arquitectura**: Diagrama de arquitectura hexagonal

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create a .env file** in the project root with the following variables:
   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Run the application**:
   ```bash
   npm start
   ```
   
   Or for development with hot-reloading:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── domain/                 # Domain layer (core business logic)
│   ├── entities/           # Business entities
│   └── services/           # Domain services
├── application/            # Application layer
│   ├── ports/              # Interfaces
│   │   ├── in/             # Input ports (use cases)
│   │   └── out/            # Output ports (repositories, services)
│   └── services/           # Application services implementing use cases
├── infrastructure/         # Infrastructure layer
│   ├── adapters/           # Adapters implementing ports
│   │   ├── in/             # Input adapters (controllers, API)
│   │   └── out/            # Output adapters (repositories, services)
│   ├── config/             # Configuration
│   └── utils/              # Utilities
└── index.ts                # Application entry point
```

### Prerequisites

- Node.js (v14 or higher) and npm (v6 or higher) **OR**
- Docker and Docker Compose (for containerized setup)

### Installation

#### Option 1: Standard Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pica
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   JWT_SECRET=your_secret_key
   PORT=3000
   ```

4. Build the application:
   ```bash
   npm run build
   ```

5. Start the server:
   ```bash
   npm start
   ```

   For development with hot reload:
   ```bash
   npm run dev
   ```

#### Option 2: Docker Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pica
   ```

2. Start the application using Docker Compose:
   
   **On Windows:**
   ```bash
   docker-start.bat
   ```
   
   **On Linux/Mac:**
   ```bash
   chmod +x docker-start.sh
   ./docker-start.sh
   ```

   This will:
   - Create a `.env` file if it doesn't exist
   - Build and start the application container
   - Start a MongoDB container for data persistence
   - Connect the containers via a Docker network

3. Access the application at http://localhost:3000

4. To stop the containers:
   ```bash
   docker-compose down
   ```

## API Endpoints

### Authentication

- **Register a new user**:
  ```
  POST /auth/register
  Body: { "username": "user1" }
  ```

- **Login**:
  ```
  POST /auth/login
  Body: { "username": "user1" }
  ```

### Game Sessions

- **Start a game timer**:
  ```
  POST /games/:userId/start
  Headers: Authorization: Bearer <token>
  ```

- **Stop a game timer**:
  ```
  POST /games/:userId/stop
  Headers: Authorization: Bearer <token>
  ```

- **Get user's game history**:
  ```
  GET /games/:userId
  Headers: Authorization: Bearer <token>
  ```

### Leaderboard

- **Get top 10 players**:
  ```
  GET /leaderboard
  ```

- **Get detailed leaderboard with pagination**:
  ```
  GET /leaderboard/detailed?limit=10&offset=0
  Headers: Authorization: Bearer <token>
  ```

## Game Logic

1. **Objective**: Stop the timer as close as possible to 10 seconds after starting it.
2. **Scoring**:
   - If the user stops within 10 seconds ±500ms (9.5-10.5 seconds), they get 1 point.
   - The leaderboard ranks users by their average deviation from 10 seconds.
3. **Session Management**:
   - Game sessions expire after 30 minutes.
   - Each user can have only one active game session at a time.

## Mejoras Implementadas y Plan Futuro

### Mejoras Ya Implementadas

1. **Arquitectura Hexagonal**:
   - Separación clara entre dominio, aplicación e infraestructura
   - Interfaces bien definidas entre capas (puertos)
   - Implementaciones intercambiables (adaptadores)

2. **Autenticación JWT Mejorada**:
   - Corrección de errores de tipo en la generación y verificación de tokens
   - Unificación del manejo de payload JWT usando `sub` para el ID de usuario
   - Implementación correcta de la interfaz `TokenService`

3. **Pruebas Unitarias**:
   - Pruebas para `JwtTokenService` (generación y verificación de tokens)
   - Pruebas para `AuthMiddleware` (autenticación y autorización)
   - Configuración de Jest con TypeScript

4. **Dockerización**:
   - Configuración de Docker y Docker Compose
   - Integración con MongoDB para persistencia
   - Scripts de inicio para facilitar el despliegue

### Plan de Escalabilidad (10,000+ Usuarios)

1. **Persistencia de Datos**:
   - Implementar adaptadores para MongoDB (ya configurado en Docker)
   - Considerar Redis para caché y gestión de sesiones
   - Diseñar índices eficientes para consultas frecuentes

2. **Escalado Horizontal**:
   - Desplegar múltiples instancias detrás de un balanceador de carga
   - Aprovechar la arquitectura hexagonal para facilitar la distribución
   - Implementar autenticación sin estado para permitir distribución de solicitudes

3. **Optimización de Rendimiento**:
   - Implementar caché para resultados de leaderboard
   - Optimizar consultas de base de datos
   - Considerar estrategias de paginación para grandes conjuntos de datos

### Próximos Pasos Prioritarios

1. **Ampliación de Pruebas**:
   - Añadir pruebas de integración para flujos completos
   - Aumentar la cobertura de pruebas unitarias
   - Implementar pruebas e2e para validar flujos de usuario

2. **Mejoras de Seguridad**:
   - Implementar validación de entrada robusta
   - Añadir protección CSRF y limitación de tasa
   - Considerar refresh tokens para mejorar la seguridad

3. **Observabilidad**:
   - Implementar logging estructurado
   - Añadir métricas para monitoreo de salud
   - Configurar alertas para anomalías del sistema

4. **CI/CD**:
   - Configurar pipeline de integración continua
   - Automatizar pruebas y despliegue
   - Implementar análisis estático de código

## Testing with Postman

A Postman collection is included in the `postman` directory. Import this collection to test all API endpoints.

The collection includes:
- Authentication flow
- Game session management
- Leaderboard retrieval
- Edge case testing

## License

Dante Panella
panella.dante@gmail.com
