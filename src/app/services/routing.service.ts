import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router) { }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToLogin(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
