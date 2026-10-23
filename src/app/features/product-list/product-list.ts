import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { Product } from '../../services/models/product.model';
import { GetResponseProducts } from '../../services/models/api-responses.model';
import { NgbPagination, NgbPaginationNext, NgbPaginationNumber, NgbPaginationPages, NgbPaginationPrevious } from '@ng-bootstrap/ng-bootstrap';
import '@angular/localize/init';
import { getCartItemFromProduct, pageNumberFromAPItoUI, pageNumberFromUItoAPI } from '../../shared/utils/common.util';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../services/models/cart-item.model';
import { PATHS } from '../../common/app-paths';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, CurrencyPipe, RouterLink, NgbPagination],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly PATHS = PATHS;
  readonly products = signal<Product[]>([]);
  readonly error = signal<string | null>(null);
  
  currentCategoryId = 1;
  searchMode = false;

  previousKeyword: string | null = '';
  
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap(params => this.loadProducts(params)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(response => this.successHandler(response));
  }

  private loadProducts(params: ParamMap): Observable<GetResponseProducts> {
    const keyword = params.get('keyword');
    this.searchMode = keyword !== null;
    this.currentCategoryId = Number(params.get('id') ?? 1);
    this.error.set(null);

    const request$ = this.searchMode
      ? this.handleSearchProducts(keyword!)
      : this.productService.getProductListPaginated(this.currentCategoryId, pageNumberFromUItoAPI(this.thePageNumber), this.thePageSize);

    return request$.pipe(
      catchError(() => {
        this.error.set('Could not load products.');
        return of({} as GetResponseProducts);
      }),
    );
  }

  private handleSearchProducts(keyword: string): Observable<GetResponseProducts> {
    if (this.previousKeyword !== keyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = keyword;
    return this.productService.searchProductsPaginated(keyword, pageNumberFromUItoAPI(this.thePageNumber), this.thePageSize);
  }

  private successHandler(response: GetResponseProducts): void {
    this.products.set(response._embedded.products);
    this.thePageNumber =  pageNumberFromAPItoUI(response.page.number);
    this.thePageSize = response.page.size;
    this.theTotalElements = response.page.totalElements;
  }

  pageChangeHandler(pageNumber: number): void {
    this.thePageNumber = pageNumber;
    this.loadProducts(this.route.snapshot.paramMap).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(response => this.successHandler(response));
  }

  updatePageSize(pageSize: string): void {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.loadProducts(this.route.snapshot.paramMap).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(response => this.successHandler(response));
  }

  addToCart(product: Product): void {
    const cartItem: CartItem = getCartItemFromProduct(product);
    this.cartService.addToCart(cartItem);
  }

}

