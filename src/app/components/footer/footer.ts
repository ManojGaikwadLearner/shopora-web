import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PATHS } from '../../common/app-paths';

@Component({
  imports: [RouterLink],
  selector: 'app-footer',
  styleUrl: './footer.scss',
  templateUrl: './footer.html',
})
export class Footer {
  readonly PATHS = PATHS;
}
