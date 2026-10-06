import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductServices } from '../../Services/product-services';
import { Producto } from '../../Models/producto';
import { Navbar } from '../../components/navbar/navbar';
import { ProductCard } from '../../components/product-card/product-card';

@Component({
  imports: [Navbar, ProductCard],
  selector: 'app-tienda',
  styleUrl: './tienda.css',
  templateUrl: './tienda.html',
})
export class Tienda implements OnInit {
  private productServices = inject(ProductServices);

  protected readonly productos = signal<Producto[]>([]);
  protected readonly error = signal('');

  ngOnInit() {
    this.productServices.getProductos().subscribe({
      next: (data) => this.productos.set(data),
      error: () =>
        this.error.set('No se pudo conectar con la API. ¿Está corriendo en el puerto 5080?'),
    });
  }
}
