import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="p-6 bg-white">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">
          Dashboard Administrateur
        </h1>
        <div class="bg-gray-100 rounded-lg p-4">
          <p class="text-gray-700">Bienvenue, {{ username }}</p>
          <p class="text-gray-600">Rôle : {{ userRole }}</p>
        </div>
        <!-- Ajoutez plus de contenu administrateur ici -->
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  username: string = '';
  userRole: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const decodedToken = this.authService.getDecodedToken();
    if (decodedToken) {
      this.username = decodedToken.sub;
      this.userRole = decodedToken.role;
    }
  }
}
