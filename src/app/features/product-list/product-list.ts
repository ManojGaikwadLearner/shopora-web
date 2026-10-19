import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { Product } from '../../services/models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly products = signal<Product[]>([]);
  readonly error = signal<string | null>(null);

  currentCategoryId = 1;
  searchMode = false;

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap(params => this.loadProducts(params)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(products => this.products.set(products));
  }

  private loadProducts(params: ParamMap): Observable<Product[]> {
    const keyword = params.get('keyword');
    this.searchMode = keyword !== null;
    this.currentCategoryId = Number(params.get('id') ?? 1);
    this.error.set(null);

    const request$ = this.searchMode
      ? this.productService.searchProducts(keyword!)
      : this.productService.getProductsByCategoryId(this.currentCategoryId);

    return request$.pipe(
      catchError(() => {
        this.error.set('Could not load products.');
        return of([] as Product[]);
      }),
    );
  }

}

