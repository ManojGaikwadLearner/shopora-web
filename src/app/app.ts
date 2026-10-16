import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductList } from './components/product-list/product-list';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('angular-ecommerce');
}
