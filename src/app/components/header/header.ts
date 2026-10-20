import { Component } from '@angular/core';
import { Search } from '../search/search';
import { CartStatus } from '../cart-status/cart-status';

@Component({
  selector: 'app-header',
  imports: [Search, CartStatus],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}