import { CurrencyPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Search } from '../search/search';

@Component({
  selector: 'app-header',
  imports: [Search, CurrencyPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  // Replace these with your real cart service signals later.
  protected readonly cartTotal = signal(19.22);
  protected readonly cartCount = signal(2);
}