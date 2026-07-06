export interface Prestamo {
  idPrestamo?: number;
  idLibro: number;
  idEstudiante: number;
  tituloLibro?: string;
  nombreEstudiante?: string;
  fecha?: string;
  fechaRecojo?: string;
  fechaEntrega?: string;
  fechaConfirmacion?: string;
  fechaDevolucion?: string;
  estado?: string;
  motivo: string;
  curso?: string;
  observaciones?: string;
  estadoDevolucion?: string;
  observacionesDev?: string;
}
