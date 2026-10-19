import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  private readonly router = inject(Router);

  protected readonly keyword = signal('');

  protected onInput(value: string) {
    this.keyword.set(value);
    if (!value.trim()) {
      void this.router.navigate(['/product-list']);
    }
  }

  protected submit(event: Event) {
    event.preventDefault();
    const term = this.keyword().trim();
    if (term) {
      void this.router.navigate(['/search', term]);
    }
  }

  protected clear(input: HTMLInputElement) {
    this.keyword.set('');
    input.focus();
    void this.router.navigate(['/product-list']);
  }
}
