export interface Libro {
  idLibro?: number;
  titulo: string;
  autor: string;
  isbn: string;
  editorial?: string;
  anio?: number;
  categoria: string;
  stock: number;
  stockTotal: number;
  descripcion?: string;
  recurso?: string;
}
