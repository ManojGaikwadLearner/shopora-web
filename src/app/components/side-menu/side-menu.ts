import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss',
})
export class SideMenu {
  protected readonly categories = [
    { id: 1, name: 'Books' },
    { id: 2, name: 'Coffee Mugs' },
    { id: 3, name: 'Mouse Pads' },
    { id: 4, name: 'Luggage Tags' },
  ];
}