import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SideMenu } from './components/side-menu/side-menu';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { PageLayout } from './components/page-layout/page-layout';

interface ChromeConfig {
  chrome?: boolean;   // all three at once
  sidebar?: boolean;
  header?: boolean;
  footer?: boolean;
}

@Component({
  imports: [RouterOutlet, PageLayout, SideMenu, Header, Footer],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('angular-ecommerce');

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly routeData = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => deepestChild(this.route).snapshot.data as ChromeConfig),
    ),
    { initialValue: {} as ChromeConfig },
  );

  private readonly chrome = computed(() => this.routeData().chrome ?? true);
  protected readonly showSidebar = computed(() => this.routeData().sidebar ?? this.chrome());
  protected readonly showHeader = computed(() => this.routeData().header ?? this.chrome());
  protected readonly showFooter = computed(() => this.routeData().footer ?? this.chrome());
}

function deepestChild(route: ActivatedRoute): ActivatedRoute {
  let current = route;
  while (current.firstChild) {
    current = current.firstChild;
  }
  return current;
}
