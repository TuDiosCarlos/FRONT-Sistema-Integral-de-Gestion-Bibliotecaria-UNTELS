export interface Sancion {
  idSancion?: number;
  idEstudiante: number;
  motivo: string;
  diasSuspension: number;
  multa: number;
  estado: 'activa' | 'cumplida';
  fechaCreacion?: string;
  fechaFin?: string;
}
