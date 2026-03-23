"""
Router para operaciones CRUD de usuarios
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models import User, UserCreate, UserUpdate, UserDB, MessageResponse
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Crear router
router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Usuario no encontrado"}},
)

# Funciones auxiliares para operaciones de BD

def get_user_by_id(db: Session, user_id: int) -> UserDB:
    """Obtener usuario por ID"""
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario con ID {user_id} no encontrado"
        )
    return user

def get_user_by_email(db: Session, email: str) -> UserDB:
    """Obtener usuario por email"""
    return db.query(UserDB).filter(UserDB.email == email).first()

# Endpoints

@router.get("/", response_model=List[User])
async def get_users(
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(100, ge=1, le=1000, description="Límite de registros a retornar"),
    db: Session = Depends(get_db)
):
    """
    Obtener lista de todos los usuarios con paginación
    """
    try:
        users = db.query(UserDB).offset(skip).limit(limit).all()
        logger.info(f"Obtenidos {len(users)} usuarios (skip={skip}, limit={limit})")
        return users
    except Exception as e:
        logger.error(f"Error al obtener usuarios: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al obtener usuarios"
        )

@router.get("/{user_id}", response_model=User)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """
    Obtener un usuario específico por su ID
    """
    try:
        user = get_user_by_id(db, user_id)
        logger.info(f"Usuario obtenido: {user.name} (ID: {user_id})")
        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al obtener usuario {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Crear un nuevo usuario
    """
    try:
        # Verificar si el email ya existe
        existing_user = get_user_by_email(db, user.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un usuario con el email {user.email}"
            )
        
        # Crear nuevo usuario
        db_user = UserDB(**user.dict())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        logger.info(f"Usuario creado: {db_user.name} (ID: {db_user.id})")
        return db_user
        
    except HTTPException:
        raise
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Error de integridad al crear usuario: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error de integridad de datos (posible email duplicado)"
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error al crear usuario: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al crear usuario"
        )

@router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: int, 
    user_update: UserUpdate, 
    db: Session = Depends(get_db)
):
    """
    Actualizar un usuario existente
    """
    try:
        # Obtener usuario existente
        db_user = get_user_by_id(db, user_id)
        
        # Verificar email único si se está actualizando
        if user_update.email and user_update.email != db_user.email:
            existing_user = get_user_by_email(db, user_update.email)
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Ya existe un usuario con el email {user_update.email}"
                )
        
        # Actualizar solo los campos proporcionados
        update_data = user_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        db.commit()
        db.refresh(db_user)
        
        logger.info(f"Usuario actualizado: {db_user.name} (ID: {user_id})")
        return db_user
        
    except HTTPException:
        raise
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Error de integridad al actualizar usuario {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error de integridad de datos"
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error al actualizar usuario {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al actualizar usuario"
        )

@router.delete("/{user_id}", response_model=MessageResponse)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    """
    Eliminar un usuario
    """
    try:
        # Obtener usuario existente
        db_user = get_user_by_id(db, user_id)
        user_name = db_user.name
        
        # Eliminar usuario
        db.delete(db_user)
        db.commit()
        
        logger.info(f"Usuario eliminado: {user_name} (ID: {user_id})")
        return MessageResponse(message=f"Usuario {user_name} eliminado exitosamente")
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error al eliminar usuario {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al eliminar usuario"
        )

# Endpoint adicional para buscar usuarios por nombre o email
@router.get("/search/", response_model=List[User])
async def search_users(
    q: str = Query(..., min_length=1, description="Término de búsqueda"),
    db: Session = Depends(get_db)
):
    """
    Buscar usuarios por nombre o email
    """
    try:
        users = db.query(UserDB).filter(
            (UserDB.name.ilike(f"%{q}%")) | 
            (UserDB.email.ilike(f"%{q}%"))
        ).all()
        
        logger.info(f"Búsqueda '{q}': {len(users)} usuarios encontrados")
        return users
        
    except Exception as e:
        logger.error(f"Error en búsqueda '{q}': {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor en la búsqueda"
        )