# NOC App - Network Operations Center

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Clean Architecture](https://img.shields.io/badge/Architecture-Clean-brightgreen.svg)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

Un sistema de monitoreo de red (NOC) construido con TypeScript que supervisa la disponibilidad de servicios web mediante verificaciones programadas usando cron jobs. Implementa Clean Architecture con sistema completo de logging y persistencia en archivos.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Base de Datos](#-base-de-datos)
- [Docker](#-docker)
- [Ejemplos](#-ejemplos)
- [Desarrollo](#-desarrollo)
- [Contribución](#-contribución)

## ✨ Características

- 🔍 **Monitoreo Continuo**: Verificaciones automáticas de servicios web cada 5 segundos
- 📊 **Sistema de Logs Avanzado**: Registro detallado con niveles de severidad y persistencia en archivos
- 🏗️ **Arquitectura Limpia**: Implementación completa de Clean Architecture con separación de capas
- ⚡ **TypeScript**: Desarrollo type-safe con las últimas características de ES
- 🔄 **Cron Jobs**: Programación flexible de tareas de monitoreo
- 💾 **Persistencia de Datos**: Sistema de archivos para almacenamiento de logs por severidad
- 🔧 **Inyección de Dependencias**: Patrón de inversión de dependencias implementado
- 📈 **Escalable**: Diseño modular para fácil extensión y mantenimiento

## 🏛️ Arquitectura

El proyecto sigue los principios de Clean Architecture con separación clara de responsabilidades:

```mermaid
graph TB
    subgraph "Presentation Layer"
        A[Server] --> B[CronService]
    end

    subgraph "Application Layer"
        C[CheckServiceUC]
    end

    subgraph "Domain Layer"
        D[LogEntity]
        E[LogRepository Abstract]
        F[LogDatasource Abstract]
        G[LogSeverityLevel Enum]
    end

    subgraph "Infrastructure Layer"
        H[ILogRepository]
        I[FileSystemDataSource]
    end

    A --> C
    C --> D
    C --> E
    E --> F
    H --> E
    I --> F
    H --> I

    C --> E
    E --> F
    F --> G
```

### Estructura del Proyecto

```
src/
├── domain/                    # Lógica de negocio
│   ├── entities/             # Entidades del dominio
│   │   └── log.entity.ts     # Entidad de logs con fromJson
│   ├── repository/           # Interfaces de repositorios
│   │   └── log.repository.ts # Repositorio abstracto
│   ├── datasources/          # Interfaces de fuentes de datos
│   │   └── log.datasource.ts # DataSource abstracto
│   └── use-cases/            # Casos de uso
│       └── checks/           # Servicios de verificación
├── infrastructure/           # Implementaciones técnicas
│   ├── datasources/          # Implementaciones de fuentes de datos
│   │   └── file-system.datasource.ts # Persistencia en archivos
│   └── repository/           # Implementaciones de repositorios
│       └── log.repository.impl.ts # Implementación del repositorio
└── presentation/             # Capa de presentación
    ├── cron/                # Servicios de programación
    │   └── cron-service.ts  # Manejo de cron jobs
    └── server.ts            # Servidor principal con DI
```

## 🚀 Instalación

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- Docker (opcional)

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/noc-app.git
cd noc-app

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Configuración de monitoreo
CHECK_INTERVAL=*/5 * * * * *
DEFAULT_URL=https://www.google.com

# Configuración de logs
LOG_LEVEL=info
LOG_FILE_PATH=./logs
LOG_ALL_FILE=logs-all.log
LOG_MEDIUM_FILE=logs-medium.log
LOG_HIGH_FILE=logs-high.log

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=noc_db
DB_USER=noc_user
DB_PASSWORD=noc_password
```

### Configuración de TypeScript

El proyecto utiliza configuración moderna de TypeScript con:

| Opción    | Valor    | Descripción                           |
| --------- | -------- | ------------------------------------- |
| `target`  | `esnext` | Compilación a la última versión de ES |
| `module`  | `esnext` | Uso de módulos ES modernos            |
| `strict`  | `true`   | Verificación estricta de tipos        |
| `baseUrl` | `./src`  | Ruta base para imports                |

## 🎯 Uso

### Inicio Rápido

```typescript
import { Server } from "./presentation/server";

// Iniciar el servidor NOC
Server.start();
```

### Configuración de Monitoreo

```typescript
import { CheckServiceUC } from "./domain/use-cases/checks/check-service";
import { CronService } from "./presentation/cron/cron-service";
import { FileSystemDataSource } from "./infrastructure/datasources/file-system.datasource";
import { ILogRepository } from "./infrastructure/repository/log.repository.impl";

// Configurar dependencias
const fileSystemDataSource = new FileSystemDataSource();
const logRepository = new ILogRepository(fileSystemDataSource);

// Crear servicio de verificación con logging
const checkService = new CheckServiceUC(
  logRepository,
  () => console.log("✅ Servicio disponible"),
  (error) => console.log("❌ Error:", error)
);

// Programar verificación cada 30 segundos
CronService.createJob("*/30 * * * * *", async () => {
  await checkService.execute("https://mi-servicio.com");
});
```

## 📊 Sistema de Logging

### Niveles de Severidad

| Nivel    | Descripción                                | Archivo de Destino                                 |
| -------- | ------------------------------------------ | -------------------------------------------------- |
| `low`    | Información general, servicios funcionando | `logs-all.log`                                     |
| `medium` | Advertencias, latencia alta                | `logs-all.log`, `logs-medium.log`                  |
| `high`   | Errores críticos, servicios caídos         | `logs-all.log`, `logs-medium.log`, `logs-high.log` |

### Estructura de Logs

```mermaid
flowchart TD
    A[LogEntity] --> B{Nivel de Severidad}
    B -->|low| C[logs-all.log]
    B -->|medium| D[logs-all.log + logs-medium.log]
    B -->|high| E[logs-all.log + logs-medium.log + logs-high.log]

    F[FileSystemDataSource] --> G[Crear directorio logs/]
    G --> H[Inicializar archivos]
    H --> I[Escribir logs JSON]
```

### Formato de Logs

Cada log se almacena como una línea JSON con la siguiente estructura:

```json
{
  "level": "high",
  "message": "Error on check service https://example.com",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Recuperación de Logs

```typescript
// Obtener todos los logs
const allLogs = await logRepository.getLogs(LogSeverityLevel.low);

// Obtener solo logs de advertencia y críticos
const warningLogs = await logRepository.getLogs(LogSeverityLevel.medium);

// Obtener solo logs críticos
const criticalLogs = await logRepository.getLogs(LogSeverityLevel.high);

// Deserializar log desde JSON
const logFromJson = LogEntity.fromJson(jsonString);
```

## 🌐 API Endpoints

### Monitoreo de Servicios

```http
POST /api/v1/checks
Content-Type: application/json

{
  "url": "https://example.com",
  "interval": "*/5 * * * * *"
}
```

**Respuesta:**

```json
{
  "success": true,
  "checkId": "check_123",
  "message": "Monitoreo iniciado correctamente"
}
```

### Obtener Logs

```http
GET /api/v1/logs?level=high&limit=50
```

**Respuesta:**

```json
{
  "logs": [
    {
      "id": "log_456",
      "level": "high",
      "message": "Error on check service https://example.com",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1
}
```

### Estados de Servicios

```http
GET /api/v1/status
```

**Respuesta:**

```json
{
  "services": [
    {
      "url": "https://example.com",
      "status": "up",
      "lastCheck": "2024-01-15T10:35:00Z",
      "responseTime": 245
    }
  ],
  "summary": {
    "total": 1,
    "up": 1,
    "down": 0
  }
}
```

## 🗄️ Base de Datos

### Esquema de Base de Datos

```mermaid
erDiagram
    LOGS {
        uuid id PK
        string level
        text message
        timestamp created_at
        timestamp updated_at
    }

    SERVICES {
        uuid id PK
        string url
        string name
        boolean active
        string cron_pattern
        timestamp created_at
    }

    CHECKS {
        uuid id PK
        uuid service_id FK
        boolean success
        integer response_time
        text error_message
        timestamp checked_at
    }

    SERVICES ||--o{ CHECKS : has
    CHECKS ||--o{ LOGS : generates
```

### Configuración con Docker

```sql
-- Crear base de datos
CREATE DATABASE noc_db;

-- Crear usuario
CREATE USER noc_user WITH PASSWORD 'noc_password';
GRANT ALL PRIVILEGES ON DATABASE noc_db TO noc_user;

-- Tabla de logs
CREATE TABLE logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(10) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de servicios
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    active BOOLEAN DEFAULT true,
    cron_pattern VARCHAR(50) DEFAULT '*/5 * * * * *',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🐳 Docker

### Docker Compose

```yaml
version: "3.8"

services:
  noc-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=noc_db
      - DB_USER=noc_user
      - DB_PASSWORD=noc_password
    depends_on:
      - postgres
      - redis
    volumes:
      - ./logs:/app/logs

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=noc_db
      - POSTGRES_USER=noc_user
      - POSTGRES_PASSWORD=noc_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  postgres_data:
  redis_data:
  grafana_data:
```

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]
```

### Comandos Docker

```bash
# Construir y ejecutar con Docker Compose
docker-compose up -d

# Ver logs
docker-compose logs -f noc-app

# Ejecutar migraciones
docker-compose exec noc-app npm run migrate

# Detener servicios
docker-compose down
```

## 📝 Ejemplos

### Ejemplo 1: Monitoreo Básico

```typescript
import { CheckServiceUC } from "@domain/use-cases/checks/check-service";
import { LogEntity, LogSeverityLevel } from "@domain/entities/log.entity";
import { FileSystemDataSource } from "@infrastructure/datasources/file-system.datasource";
import { ILogRepository } from "@infrastructure/repository/log.repository.impl";

const monitorService = async () => {
  // Configurar sistema de logging
  const fileSystemDataSource = new FileSystemDataSource();
  const logRepository = new ILogRepository(fileSystemDataSource);

  const checkService = new CheckServiceUC(
    logRepository,
    () => console.log("✅ Servicio disponible - Log guardado"),
    (error) => console.log("❌ Error registrado:", error)
  );

  // Verificar múltiples servicios
  const services = [
    "https://www.google.com",
    "https://www.github.com",
    "https://www.stackoverflow.com",
  ];

  for (const service of services) {
    await checkService.execute(service);
  }

  // Obtener logs por severidad
  const highSeverityLogs = await logRepository.getLogs(LogSeverityLevel.high);
  console.log("Logs críticos:", highSeverityLogs.length);
};

monitorService();
```

### Ejemplo 2: Configuración Avanzada de Cron

```typescript
import { CronService } from "@presentation/cron/cron-service";

// Diferentes patrones de cron
const cronPatterns = {
  everySecond: "* * * * * *",
  every5Seconds: "*/5 * * * * *",
  everyMinute: "0 * * * * *",
  every5Minutes: "0 */5 * * * *",
  everyHour: "0 0 * * * *",
  daily: "0 0 0 * * *",
};

// Monitoreo crítico cada segundo
CronService.createJob(cronPatterns.everySecond, async () => {
  await checkCriticalServices();
});

// Monitoreo regular cada 5 minutos
CronService.createJob(cronPatterns.every5Minutes, async () => {
  await checkRegularServices();
});
```

### Ejemplo 3: Sistema de Archivos de Logs

```typescript
import { LogEntity, LogSeverityLevel } from "@domain/entities/log.entity";
import { FileSystemDataSource } from "@infrastructure/datasources/file-system.datasource";
import { ILogRepository } from "@infrastructure/repository/log.repository.impl";

class LoggingExample {
  private logRepository: ILogRepository;

  constructor() {
    const fileSystemDataSource = new FileSystemDataSource();
    this.logRepository = new ILogRepository(fileSystemDataSource);
  }

  async demonstrateLogging() {
    // Crear logs de diferentes severidades
    const lowLog = new LogEntity("Sistema iniciado correctamente", LogSeverityLevel.low);
    const mediumLog = new LogEntity(
      "Advertencia: Latencia alta detectada",
      LogSeverityLevel.medium
    );
    const highLog = new LogEntity("Error crítico: Servicio no disponible", LogSeverityLevel.high);

    // Guardar logs (se almacenan automáticamente en archivos separados)
    await this.logRepository.saveLog(lowLog);
    await this.logRepository.saveLog(mediumLog);
    await this.logRepository.saveLog(highLog);

    // Recuperar logs por severidad
    const allLogs = await this.logRepository.getLogs(LogSeverityLevel.low); // Todos los logs
    const mediumLogs = await this.logRepository.getLogs(LogSeverityLevel.medium); // Solo medium y high
    const criticalLogs = await this.logRepository.getLogs(LogSeverityLevel.high); // Solo high

    console.log(`Total logs: ${allLogs.length}`);
    console.log(`Logs de advertencia y críticos: ${mediumLogs.length}`);
    console.log(`Logs críticos: ${criticalLogs.length}`);
  }

  // Ejemplo de deserialización desde JSON
  loadLogFromJson() {
    const jsonLog = '{"message":"Test log","level":"high","createdAt":"2023-01-01T00:00:00.000Z"}';
    const logEntity = LogEntity.fromJson(jsonLog);
    console.log("Log cargado:", logEntity);
  }
}

// Estructura de archivos creada automáticamente:
// logs/
// ├── logs-all.log      # Todos los logs (low, medium, high)
// ├── logs-medium.log   # Logs medium y high
// └── logs-high.log     # Solo logs high (críticos)
```

### Ejemplo 4: Solicitudes HTTP

```bash
# Iniciar monitoreo de un nuevo servicio
curl -X POST http://localhost:3000/api/v1/checks \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://mi-api.com/health",
    "interval": "*/30 * * * * *",
    "name": "API Principal"
  }'

# Obtener logs de errores
curl "http://localhost:3000/api/v1/logs?level=high&limit=10"

# Verificar estado de todos los servicios
curl "http://localhost:3000/api/v1/status"

# Obtener métricas de rendimiento
curl "http://localhost:3000/api/v1/metrics"
```

## 🛠️ Desarrollo

### Scripts Disponibles

| Script               | Descripción                               |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | Ejecuta en modo desarrollo con hot reload |
| `npm run build`      | Construye la aplicación para producción   |
| `npm start`          | Ejecuta la aplicación construida          |
| `npm test`           | Ejecuta las pruebas unitarias             |
| `npm run test:watch` | Ejecuta pruebas en modo watch             |
| `npm run lint`       | Ejecuta el linter                         |
| `npm run format`     | Formatea el código                        |

### Estructura de Desarrollo

```mermaid
flowchart LR
    A[Desarrollo Local] --> B[Pruebas Unitarias]
    B --> C[Integración]
    C --> D[Build]
    D --> E[Deploy]

    subgraph "Herramientas"
        F[TypeScript]
        G[ESLint]
        H[Prettier]
        I[Jest]
    end
```

### Configuración del Entorno de Desarrollo

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "bradlc.vscode-tailwindcss"
  ],
  "settings": {
    "typescript.preferences.importModuleSpecifier": "relative",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  }
}
```

## 🤝 Contribución

### Proceso de Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- Utiliza TypeScript estricto
- Sigue los principios de Clean Architecture
- Escribe pruebas para nuevas funcionalidades
- Documenta las APIs públicas
- Usa conventional commits

### Roadmap

- [x] Sistema de logging con archivos separados por severidad
- [x] Implementación completa de Clean Architecture
- [x] Inyección de dependencias
- [x] Deserialización de logs desde JSON
- [ ] Interfaz web para monitoreo de logs
- [ ] Rotación automática de archivos de logs
- [ ] Integración con Slack/Discord para alertas
- [ ] Métricas avanzadas con Prometheus
- [ ] Soporte para múltiples bases de datos (PostgreSQL, MongoDB)
- [ ] API REST completa para gestión de logs
- [ ] API GraphQL
- [ ] Autenticación y autorización
- [ ] Clustering y alta disponibilidad
- [ ] Compresión de logs antiguos
- [ ] Dashboard en tiempo real

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

- 📧 Email: support@noc-app.com
- 💬 Discord: [NOC Community](https://discord.gg/noc-app)
- 📖 Documentación: [docs.noc-app.com](https://docs.noc-app.com)
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/noc-app/issues)

---

**Desarrollado con ❤️ por el equipo de NOC App**
