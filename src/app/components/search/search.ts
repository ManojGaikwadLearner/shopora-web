import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-search',
  styleUrl: './search.scss',
  templateUrl: './search.html',
})
export class Search {
  private readonly router = inject(Router);

  protected search(keyword: string) {
    const term = keyword.trim();
    if (term) {
      void this.router.navigate(['/search', term]);
    }
  }

}
