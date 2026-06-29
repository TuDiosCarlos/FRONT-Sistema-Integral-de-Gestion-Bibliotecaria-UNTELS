export interface Usuario {
  idUsuario?: number;
  username: string;
  password?: string;
  codigo: string;
  carnet: string;
  dni: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;          
  carrera: string;
  ciclo: number;
  estado: string;       
}

export interface UsuarioDTO {
  idUsuario?: number;
  username: string;
  password?: string;
  codigo: string;
  carnet: string;
  dni: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;
  carrera: string;
  ciclo: number;
  estado: string;
}