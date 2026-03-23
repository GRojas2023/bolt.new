"""
Modelos de base de datos usando SQLAlchemy
"""
from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# Modelo de SQLAlchemy para la base de datos
class UserDB(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    age = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<User(id={self.id}, name='{self.name}', email='{self.email}')>"

# Modelos Pydantic para validación y serialización

class UserBase(BaseModel):
    """Campos base compartidos entre modelos"""
    name: str = Field(..., min_length=1, max_length=100, description="Nombre completo del usuario")
    email: EmailStr = Field(..., description="Dirección de email válida")
    age: int = Field(..., ge=1, le=120, description="Edad entre 1 y 120 años")

class UserCreate(UserBase):
    """Modelo para crear un nuevo usuario"""
    pass

class UserUpdate(BaseModel):
    """Modelo para actualizar un usuario (campos opcionales)"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    age: Optional[int] = Field(None, ge=1, le=120)

class User(UserBase):
    """Modelo completo del usuario con datos de BD"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True  # Para compatibilidad con SQLAlchemy

class UserList(BaseModel):
    """Modelo para lista de usuarios con metadatos"""
    users: list[User]
    total: int
    page: int = 1
    per_page: int = 100

# Modelos de respuesta

class MessageResponse(BaseModel):
    """Respuesta simple con mensaje"""
    message: str

class ErrorResponse(BaseModel):
    """Modelo para respuestas de error"""
    detail: str
    error_code: Optional[str] = None

class HealthResponse(BaseModel):
    """Respuesta del health check"""
    status: str
    message: str
    timestamp: datetime
    version: str = "1.0.0"