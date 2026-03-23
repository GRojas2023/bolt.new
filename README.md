# Aplicación Full-Stack: React + FastAPI

Esta es una aplicación web completa que conecta un frontend React con un backend FastAPI.

## 🏗️ Estructura del Proyecto

```
/
├── frontend/                 # Frontend React (WebContainer)
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # Servicios para API calls
│   │   ├── types/           # Definición de tipos TypeScript
│   │   └── App.tsx          # Componente principal
│   ├── package.json
│   └── ...
├── backend/                 # Backend FastAPI (referencia local)
│   ├── app/
│   │   ├── main.py         # Aplicación principal FastAPI
│   │   ├── models.py       # Modelos de datos
│   │   ├── database.py     # Configuración de base de datos
│   │   └── routers/        # Endpoints organizados
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

## 🚀 Instalación y Uso

### Frontend (React - Ya funcionando en WebContainer)
El frontend ya está ejecutándose en el WebContainer y puedes verlo inmediatamente.

### Backend (FastAPI - Para ejecutar localmente)

1. **Crear entorno virtual:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

2. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Ejecutar el servidor:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Acceder a la documentación:**
   - API Docs: http://localhost:8000/docs
   - Redoc: http://localhost:8000/redoc

## 🔧 Configuración

### Variables de Entorno (.env)
```
DATABASE_URL=sqlite:///./users.db
SECRET_KEY=tu-clave-secreta-aqui
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 📱 Funcionalidades

- ✅ Gestión completa de usuarios (CRUD)
- ✅ Validación de datos en frontend y backend
- ✅ Manejo de errores y respuestas
- ✅ Interfaz responsive y moderna
- ✅ Documentación automática de API
- ✅ Base de datos SQLite (fácil de cambiar a PostgreSQL)

## 🛠️ Tecnologías Utilizadas

**Frontend:**
- React 18 con TypeScript
- Tailwind CSS para estilos
- Lucide React para iconos
- Fetch API para requests HTTP

**Backend:**
- FastAPI
- SQLAlchemy para ORM
- Pydantic para validación
- SQLite/PostgreSQL para base de datos
- CORS middleware

## 📚 Endpoints de la API

- `GET /users/` - Obtener todos los usuarios
- `POST /users/` - Crear nuevo usuario
- `GET /users/{user_id}` - Obtener usuario por ID
- `PUT /users/{user_id}` - Actualizar usuario
- `DELETE /users/{user_id}` - Eliminar usuario
- `GET /` - Health check