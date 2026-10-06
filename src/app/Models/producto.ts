export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl?: string | null;
}

export interface ProductoDTO {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenBase64?: string | null;
}
