// Tipos TypeScript para la aplicación
export interface User {
  id?: number;
  name: string;
  email: string;
  age: number;
  created_at?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  age: number;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  age?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}