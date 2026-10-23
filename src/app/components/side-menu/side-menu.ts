import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductCategory } from '../../services/models/product-cateory.model';
import { PATHS } from '../../common/app-paths';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-side-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss',
})
export class SideMenu implements OnInit {
  productService: ProductService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  readonly PATHS = PATHS;
  productCategories = signal<ProductCategory[]>([]);

  ngOnInit() {
    this.loadProductCategories();
  }

  private loadProductCategories() {
    this.productService.getProductCategories().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: categories => this.productCategories.set(categories),
      error: () => this.productCategories.set([]),
    });
  }
}