import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { Product } from '../../services/models/product.model';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  imports: [CommonModule,CurrencyPipe, RouterLink],
  selector: 'app-product-details',
  styleUrl: './product-details.scss',
  templateUrl: './product-details.html',
})
export class ProductDetails {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly product = signal<Product | null>(null);
  readonly error = signal<string | null>(null);

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap(params => this.loadProduct(params)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(product => this.product.set(product));
  }

  private loadProduct(params: ParamMap): Observable<Product> {

    const productId = Number(params.get('id'));
    this.error.set(null);

    return this.productService.getProduct(productId).pipe(
      catchError(() => {
        this.error.set('Could not load product details.');
        return of({} as Product);
      }),
    );
  }

}
