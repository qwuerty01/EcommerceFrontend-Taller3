import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductServices } from '../../Services/product-services';
import { Producto, ProductoDTO } from '../../Models/producto';

@Component({
  imports: [CurrencyPipe, ReactiveFormsModule],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private productServices = inject(ProductServices);
  private fb = inject(FormBuilder);

  protected readonly productos = signal<Producto[]>([]);
  protected readonly error = signal('');
  protected readonly mensaje = signal('');
  protected readonly editandoId = signal<number | null>(null);
  protected readonly imagenBase64 = signal<string | null>(null);
  private readonly inputImagen = viewChild<ElementRef<HTMLInputElement>>('inputImagen');

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    precio: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productServices.getProductos().subscribe({
      next: (data) => this.productos.set(data),
      error: () =>
        this.error.set('No se pudo conectar con la API. ¿Está corriendo en el puerto 5080?'),
    });
  }

  seleccionarImagen(event: Event) {
    const archivo = (event.target as HTMLInputElement).files?.[0];
    if (!archivo) {
      this.imagenBase64.set(null);
      return;
    }
    const lector = new FileReader();
    lector.onload = () => this.imagenBase64.set(lector.result as string);
    lector.readAsDataURL(archivo);
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const producto: ProductoDTO = { ...this.form.getRawValue(), imagenBase64: this.imagenBase64() };
    const id = this.editandoId();
    const peticion =
      id === null
        ? this.productServices.createProducto(producto)
        : this.productServices.updateProducto(id, producto);

    peticion.subscribe({
      next: (respuesta) => {
        this.mensaje.set(respuesta);
        this.error.set('');
        this.cancelar();
        this.cargarProductos();
      },
      error: (err: HttpErrorResponse) =>
        this.error.set(err.error || 'No se pudo guardar el producto.'),
    });
  }

  editar(producto: Producto) {
    this.editandoId.set(producto.id);
    this.form.setValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? '',
      precio: producto.precio,
      stock: producto.stock,
    });
  }

  eliminar(producto: Producto) {
    if (!confirm(`¿Eliminar "${producto.nombre}"?`)) return;

    this.productServices.deleteProducto(producto.id).subscribe({
      next: (respuesta) => {
        this.mensaje.set(respuesta);
        this.cargarProductos();
      },
      error: (err: HttpErrorResponse) =>
        this.error.set(err.error || 'No se pudo eliminar el producto.'),
    });
  }

  cancelar() {
    this.editandoId.set(null);
    this.imagenBase64.set(null);
    const input = this.inputImagen()?.nativeElement;
    if (input) input.value = '';
    this.form.reset();
  }
}
