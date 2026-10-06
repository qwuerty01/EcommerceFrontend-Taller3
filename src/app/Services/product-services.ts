import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { Producto, ProductoDTO } from '../Models/producto';

@Service()
export class ProductServices {
    private httpClient = inject(HttpClient);
    private url = `${environment.apiUrl}api/producto`;

    getProductos() {
        return this.httpClient.get<Producto[]>(this.url);
    }

    createProducto(producto: ProductoDTO) {
        return this.httpClient.post(this.url, producto, { responseType: 'text' });
    }

    updateProducto(id: number, producto: ProductoDTO) {
        return this.httpClient.put(`${this.url}/${id}`, producto, { responseType: 'text' });
    }

    deleteProducto(id: number) {
        return this.httpClient.delete(`${this.url}/${id}`, { responseType: 'text' });
    }
}
