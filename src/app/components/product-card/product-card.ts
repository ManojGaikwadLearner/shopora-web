import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../services/models/product.model';
import { PATHS } from '../../common/app-paths';

@Component({
  imports: [RouterLink, CurrencyPipe],
  selector: 'app-product-card',
  styleUrl: './product-card.scss',
  templateUrl: './product-card.html',
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly addToCart = output<Product>();

  protected readonly link = computed(() => [PATHS.product, this.product().id]);
}
