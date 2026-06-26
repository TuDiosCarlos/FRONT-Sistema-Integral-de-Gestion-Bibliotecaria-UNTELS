import { Carrera } from './carrera';

export interface Student {
  id?: number;
  nombres: string;
  apellidos: string;
  dni: string;
  codigo: string;
  email: string;
  estado?: boolean;
  carrera?: Carrera;
}

export interface StudentDTO {
  nombres: string;
  apellidos: string;
  dni: string;
  codigo: string;
  email: string;
  carreraId: number;
}