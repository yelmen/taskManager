import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { RoutingService } from '../services/routing.service';
import { LoaderAndInfoService } from '../services/loader-and-info.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private routingService: RoutingService,
    private infoService: LoaderAndInfoService
  ) {}

  canActivate(): boolean {
  // In real-world applications, relying solely on localStorage for JWT validation is not secure.
  // Tokens stored in localStorage are vulnerable to XSS attacks, and there's no built-in expiration handling or token invalidation.
  // Instead, i should implement a more secure approach:
  // On each request, validate the token server-side to ensure it's still valid and hasn't been tampered with.
  // Implement token expiration and refresh logic to maintain session security.
  // Use secure transport (HTTPS) for all communications to protect tokens in transit.
  // but since our dummy api doesn't supports those. I did like this way.
    const token = localStorage.getItem('jwt');
    if (token) {
      return true;
    } else {
      this.infoService.showMessage('Please login first!');
      this.routingService.navigateToLogin();
      return false;
    }
  }
}
