import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [CurrencyPipe, CommonModule],
  selector: 'app-product-list',
  styleUrl: './product-list.scss',
  templateUrl: './product-list.html',
})
export class ProductList {

  productService: ProductService = inject(ProductService);
  route: ActivatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  currentCategoryId: number = 1;
  columns: string[] = ['', 'Product Name', 'Price', 'Units in Stock'];
  products = signal<Product[]>([]);
  readonly error = signal<string | null>(null);

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          this.currentCategoryId = Number(params.get('id') ?? 1);
          return this.productService.getProducts(this.currentCategoryId);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: products => this.products.set(products),
        error: (err: unknown) => {
          this.error.set('Could not load products.');
        },
    });
  }

  // Essential for *ngFor performance optimization
  trackById(index: number, item: Product): number {
    return index;
  }

}
