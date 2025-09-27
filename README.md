# Backend - Sistema de Gestión de Tareas

![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

Backend desarrollado con Firebase Functions, Express.js y TypeScript para un sistema de gestión de tareas y usuarios.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Desarrollo](#-desarrollo)
- [Despliegue](#-despliegue)

## 🚀 Características

- **API RESTful** completa para gestión de tareas y usuarios
- **Autenticación JWT** integrada
- **Base de datos Firestore** para persistencia de datos
- **Arquitectura escalable** con patrones Repository y Service
- **TypeScript** para type safety y desarrollo robusto
- **Despliegue serverless** con Firebase Cloud Functions

## 🛠 Tecnologías

- **Firebase Functions** - Runtime serverless
- **Express.js** - Framework web
- **TypeScript** - Lenguaje de programación
- **Firestore** - Base de datos NoSQL
- **Firebase Auth** - Autenticación de usuarios
- **CORS** - Manejo de políticas cross-origin

## 📥 Instalación

### Prerrequisitos

- Node.js 20+ 
- npm o yarn
- Firebase CLI

### Configuración del Proyecto

1. **Clonar el repositorio**
```bash
git clone https://github.com/gabmerinof/Backend.git
Local
cd Backend

ServerLess
cd Backend/functions
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Firebase**
```bash
firebase login
firebase use --add
```

🏗 Estructura del Proyecto
```text
Backend/
├── functions/
│   ├── src/
│   │   ├── config/         # Configuraciones (CORS)
│   │   ├── controllers/    # Lógica de endpoints
│   │   ├── middleware/     # Middlewares (auth)
│   │   ├── repositories/   # Acceso a datos
│   │   ├── routes/         # Definición de rutas
│   │   ├── services/       # Lógica de negocio
│   │   ├── models/         # Interfaces TypeScript
│   │   └── index.ts        # Punto de entrada
│   ├── lib/                # Código compilado
│   ├── package.json
│   └── tsconfig.json
└── firebase.json
```
💻 Desarrollo
```bash
# Compilar TypeScript
npm run build

# Compilar en modo watch (desarrollo)
npm run build:watch

# Ejecutar emuladores localmente
npm run serve

# Ejecutar tests (si están configurados)
npm test
```

🚀 Despliegue
Desplegar a producción
```bash
# Desplegar todas las functions
npm run deploy

# O desplegar manualmente
npm run build
firebase deploy --only functions
```

🧪 Testing
El proyecto incluye estructura para tests (configurar según necesidad):
```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests con cobertura
npm run test:coverage
```

🐛 Troubleshooting
Problemas comunes
Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

Error de compilación TypeScript
```bash
npm run clean
npm run build
```

Problemas de autenticación

Verificar que el token JWT sea válido

Confirmar que el usuario exista en Firebase Auth
