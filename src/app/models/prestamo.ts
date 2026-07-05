export interface Prestamo {
  idPrestamo?: number;
  idLibro: number;
  idEstudiante: number;
  fecha?: string;
  fechaRecojo?: string;
  fechaEntrega?: string;
  fechaConfirmacion?: string;
  fechaDevolucion?: string;
  estado?: 'solicitado' | 'vigente' | 'rechazado' | 'devuelto' | 'vencido';
  motivo: string;
  curso?: string;
  observaciones?: string;
  estadoDevolucion?: string;
  observacionesDev?: string;
}
