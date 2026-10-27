import { Component, DOCUMENT, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth0/auth0-angular';
import { RouterLink } from '@angular/router';
import { PATHS } from '../../common/app-paths';
import { BrowserStorage } from '../../core/browser-storage.service';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.html',
  styleUrl: './login-status.scss',
  imports: [RouterLink],
})
export class LoginStatus {
  private readonly auth = inject(AuthService);
  private readonly browserStorage: BrowserStorage = inject(BrowserStorage);
  private readonly doc = inject(DOCUMENT);

  readonly PATHS = PATHS;
  protected readonly isAuthenticated = toSignal(this.auth.isAuthenticated$, { initialValue: false });
  protected readonly user = toSignal(this.auth.user$, { initialValue: null });

  protected readonly userEmail = computed(() => this.user()?.email ?? null);

  /** Auth0 populates `name` from the IdP; fall back through given/family name, then email. */
  protected readonly userFullName = computed(() => {
    const user = this.user();
    if (!user) return null;
    const fromParts = [user.given_name, user.family_name].filter(Boolean).join(' ').trim();
    return user.name?.trim() || fromParts || user.nickname || user.email || null;
  });

  constructor() {
    effect(() => {
      const email = this.userEmail();
      if (email) {
        this.browserStorage.write('userEmail', email);
      } else {
        this.browserStorage.remove('userEmail');
      }
    });
  }

  protected login(): void {
    this.auth.loginWithRedirect();
  }

  protected logout(): void {
    this.auth.logout({ logoutParams: { returnTo: this.doc.location.origin } });
  }
}