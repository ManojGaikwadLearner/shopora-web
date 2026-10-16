import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, FormsModule, CurrencyPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly router = inject(Router);

  // Replace these with your real cart service signals later.
  protected readonly cartTotal = signal(19.22);
  protected readonly cartCount = signal(2);

  protected search(keyword: string) {
    const term = keyword.trim();
    if (term) {
      void this.router.navigate(['/search', term]);
    }
  }
}