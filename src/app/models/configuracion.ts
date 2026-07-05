export interface Configuracion {
  idConfiguracionBiblioteca?: number;
  diasMaxPrestamo: number;
  limitePrestamos: number;
  multaPorDia: number;
  schedulerActivo: boolean;
  notifEmail: boolean;
  alertaStock: boolean;
  modoMant: boolean;
}
