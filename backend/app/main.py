"""
Aplicación principal FastAPI
"""
import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from datetime import datetime
import logging

# Importar módulos locales
from app.database import create_tables, engine
from app.routers import users
from app.models import HealthResponse

# Cargar variables de entorno
load_dotenv()

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Crear aplicación FastAPI
app = FastAPI(
    title="API de Gestión de Usuarios",
    description="API REST para gestionar usuarios con FastAPI y SQLAlchemy",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configurar CORS
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware personalizado para logging
@app.middleware("http")
async def log_requests(request, call_next):
    start_time = datetime.now()
    
    # Procesar request
    response = await call_next(request)
    
    # Calcular tiempo de procesamiento
    process_time = (datetime.now() - start_time).total_seconds()
    
    # Log de la request
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.4f}s"
    )
    
    return response

# Incluir routers
app.include_router(users.router)

# Endpoints principales

@app.get("/", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint - verificar que la API esté funcionando
    """
    return HealthResponse(
        status="healthy",
        message="API de Gestión de Usuarios funcionando correctamente",
        timestamp=datetime.now(),
        version="1.0.0"
    )

@app.get("/info")
async def get_api_info():
    """
    Información general de la API
    """
    return {
        "name": "API de Gestión de Usuarios",
        "version": "1.0.0",
        "description": "API REST para gestionar usuarios",
        "endpoints": {
            "health": "/",
            "users": "/users/",
            "docs": "/docs",
            "redoc": "/redoc"
        },
        "database": {
            "url": os.getenv("DATABASE_URL", "sqlite:///./users.db"),
            "engine": str(engine.url)
        },
        "cors_origins": CORS_ORIGINS,
        "timestamp": datetime.now().isoformat()
    }

# Manejador de errores global
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """
    Manejador global de excepciones no capturadas
    """
    logger.error(f"Error no manejado en {request.url.path}: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Error interno del servidor",
            "path": str(request.url.path),
            "timestamp": datetime.now().isoformat()
        }
    )

# Evento de inicio - crear tablas
@app.on_event("startup")
async def startup_event():
    """
    Evento que se ejecuta al iniciar la aplicación
    """
    logger.info("Iniciando aplicación FastAPI...")
    
    try:
        # Crear tablas si no existen
        create_tables()
        logger.info("Tablas de base de datos verificadas/creadas")
        
        # Log de configuración
        logger.info(f"CORS Origins configurados: {CORS_ORIGINS}")
        logger.info(f"Base de datos: {os.getenv('DATABASE_URL', 'sqlite:///./users.db')}")
        logger.info("¡Aplicación iniciada exitosamente!")
        
    except Exception as e:
        logger.error(f"Error durante el inicio de la aplicación: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """
    Evento que se ejecuta al cerrar la aplicación
    """
    logger.info("Cerrando aplicación FastAPI...")

# Ejecutar directamente si es el script principal
if __name__ == "__main__":
    # Configuración del servidor
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    logger.info(f"Iniciando servidor en {host}:{port} (debug={debug})")
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )