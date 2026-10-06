import { Component, computed, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Producto } from '../../Models/producto';

export interface EstadoStock {
  texto: string;
  clase: string;
}

@Component({
  imports: [CurrencyPipe],
  selector: 'app-product-card',
  styleUrl: './product-card.css',
  templateUrl: './product-card.html',
})
export class ProductCard {
  readonly producto = input.required<Producto>();

  protected readonly estado = computed(() => estadoStock(this.producto().stock));
}

const POCAS_UNIDADES = 5;

export function estadoStock(stock: number): EstadoStock {
  if (stock <= 0) {
    return { texto: 'Agotado', clase: 'text-danger' };
  }
  if (stock === 1) {
    return { texto: '¡Última unidad!', clase: 'text-warning' };
  }
  if (stock <= POCAS_UNIDADES) {
    return { texto: `¡Últimas ${stock} unidades!`, clase: 'text-warning' };
  }
  return { texto: `${stock} disponibles`, clase: 'text-success' };
}
