import { Component } from '@angular/core';
import { Search } from '../search/search';
import { CartStatus } from '../cart-status/cart-status';
import { LoginStatus } from '../login-status/login-status';

@Component({
  selector: 'app-header',
  imports: [Search, LoginStatus, CartStatus],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}