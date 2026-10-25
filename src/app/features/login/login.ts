import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-panel">
      <h1>Sign in</h1>
      <p>You'll be redirected to our secure sign-in page.</p>
      <button type="button" class="btn btn-info" (click)="login()">Continue</button>
    </div>
  `,
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(AuthService);

  protected login(): void {
    this.auth.loginWithRedirect();
  }
}