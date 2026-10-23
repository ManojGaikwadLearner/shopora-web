import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PATHS } from '../../common/app-paths';

@Component({
  selector: 'app-search',
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  private readonly router = inject(Router);

  readonly PATHS = PATHS;
  protected readonly keyword = signal('');

  protected onInput(value: string) {
    this.keyword.set(value);
    if (!value.trim()) {
      void this.router.navigate([PATHS.productList]);
    }
  }

  protected submit(event: Event) {
    event.preventDefault();
    const term = this.keyword().trim();
    if (term) {
      void this.router.navigate([PATHS.search, term]);
    }
  }

  protected clear(input: HTMLInputElement) {
    this.keyword.set('');
    input.focus();
    void this.router.navigate([PATHS.productList]);
  }
}
