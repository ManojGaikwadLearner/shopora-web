import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-side-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss',
})
export class SideMenu {
  productService: ProductService = inject(ProductService);

  productCategories = signal<ProductCategory[]>([]);

  ngOnInit() {
    this.loadProductCategories();
  }

  private loadProductCategories() {
    this.productService.getProductCategories().subscribe({
      next: categories => this.productCategories.set(categories),
      error: () => this.productCategories.set([]),
    });
  }
}