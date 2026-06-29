export interface Prestamo {
  idPrestamo?: number; // Opcional, generado por la base de datos automáticamente
  idLibro: number; // Mapeo exacto DTO Java (idLibro)
  idUsuario?: number; // Mapeo exacto DTO Java (idUsuario)
  idEstudiante: number; // Mapeo exacto DTO Java (idEstudiante)
  fechaSolicitud?: string; // Guardado en formato de texto ISO (YYYY-MM-DD)
  fechaAprobacion?: string;
  fechaDevolucion?: string;
  diasSolicitados: number; // Mapeo exacto DTO Java (diasSolicitados)
  estadoPrestamo: 'PENDIENTE' | 'ACTIVO' | 'RECHAZADO' | 'DEVUELTO' | 'VENCIDO';
  estadoDevolucion?: string; // Mapeo exacto DTO Java (estadoDevolucion)
  observaciones?: string;
}
