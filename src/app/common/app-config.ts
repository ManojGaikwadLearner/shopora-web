import { AuthConfig } from '@auth0/auth0-angular';
import { environment } from '../../environments/environment';

const authConfig: AuthConfig = {
  domain: environment.auth.domain,
  clientId: environment.auth.clientId,
  authorizationParams: {
    redirect_uri: window.location.origin,     // snake_case, and no /login/callback
    audience: environment.auth.audience,
    scope: 'openid profile email',            // singular, space-separated string
  },
  httpInterceptor: {
    allowedList: [
      { uri: '/api/orders/*', tokenOptions: { authorizationParams: { audience: 'http://localhost:8080' } } },
      { uri: '/api/checkout/purchase', tokenOptions: { authorizationParams: { audience: 'http://localhost:8080' } } },
    ],
  },
};

export default authConfig;