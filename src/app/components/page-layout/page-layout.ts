import { Component, computed, input } from '@angular/core';

const variantClasses = {
  'content': 'page-content',
  'main': 'main-content',
  'main-page-m': 'main-content page-m',
}

@Component({
  imports: [],
  selector: 'app-page-layout',
  styleUrl: './page-layout.scss',
  templateUrl: './page-layout.html',
})
export class PageLayout {
    /** 'content' for list pages, 'main' for form pages with extra margin. */
  readonly variant = input<'content' | 'main' | 'main-page-m'>('content');

  protected readonly variantClass = computed(() => variantClasses[this.variant()]);
}
