export interface LoginRequest {
  username: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  idUsuario: number;
  username: string;
  nombre: string;
  rol: string;
}
