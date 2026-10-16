import { Component, inject, signal } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe, CommonModule],
  selector: 'app-product-list',
  styleUrl: './product-list.scss',
  templateUrl: './product-list.html',
})
export class ProductList {

  productService: ProductService = inject(ProductService);
  products = signal<Product[]>([]);
  columns: string[] = ['', 'Product Name', 'Price', 'Units in Stock'];

  ngOnInit() {
    this.loadProducts();
  }

  private loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => this.products.set(products),
      error: (err: any) => console.error(err)
    });
  }

  // Essential for *ngFor performance optimization
  trackById(index: number, item: Product): number {
    return index;
  }

}
