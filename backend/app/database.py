"""
Configuración de base de datos con SQLAlchemy
"""
import os
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# URL de la base de datos desde variables de entorno
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./users.db")

# Crear el engine de la base de datos
engine = create_engine(
    DATABASE_URL,
    # Para SQLite, necesitamos esto para permitir threads múltiples
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# Crear sesión de base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos
Base = declarative_base()

# Metadatos para migraciones
metadata = MetaData()

def get_db():
    """
    Generador que proporciona una sesión de base de datos
    y se asegura de cerrarla después del uso
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """
    Crear todas las tablas en la base de datos
    """
    Base.metadata.create_all(bind=engine)

def drop_tables():
    """
    Eliminar todas las tablas (usar con cuidado)
    """
    Base.metadata.drop_all(bind=engine)