import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { UserData } from '../resolvers/user-data.resolver';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule],
  template: `
    <app-navbar></app-navbar>
    <div class="p-6 min-h-screen bg-gray-100">
      <div class="mx-auto max-w-7xl">
        <h1 class="mb-6 text-3xl font-bold text-gray-900">
          Dashboard Administrateur
        </h1>

        <!-- Info utilisateur -->
        <div class="p-4 mb-8 bg-white rounded-lg shadow-md">
          <p class="text-lg font-medium text-gray-700">
            Bienvenue, {{ username }}
          </p>
          <p class="text-gray-600">Rôle : {{ userRole }}</p>
        </div>

        <!-- Navigation de gestion -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Gestion des Albums -->
          <div
            class="p-6 bg-white rounded-lg shadow-md transition-shadow hover:shadow-lg"
          >
            <div class="flex items-center mb-4">
              <span class="p-2 mr-4 text-purple-600 bg-purple-100 rounded-lg">
                <span class="text-2xl material-icons">album</span>
              </span>
              <h2 class="text-xl font-semibold text-gray-800">
                Gestion des Albums
              </h2>
            </div>
            <p class="mb-4 text-gray-600">
              Gérez vos albums : ajout, modification, suppression et
              organisation des chansons.
            </p>
            <div class="space-y-2">
              <button
                routerLink="albums/list"
                class="flex justify-center items-center px-4 py-2 w-full text-purple-600 bg-purple-100 rounded-lg transition-colors hover:bg-purple-200"
              >
                <span class="mr-2 material-icons">list</span>
                Liste des Albums
              </button>
            </div>
          </div>

          <!-- Gestion des Chansons -->
          <div
            class="p-6 bg-white rounded-lg shadow-md transition-shadow hover:shadow-lg"
          >
            <div class="flex items-center mb-4">
              <span class="p-2 mr-4 text-indigo-600 bg-indigo-100 rounded-lg">
                <span class="text-2xl material-icons">music_note</span>
              </span>
              <h2 class="text-xl font-semibold text-gray-800">
                Gestion des Chansons
              </h2>
            </div>
            <p class="mb-4 text-gray-600">
              Gérez vos chansons : upload, modification des métadonnées et
              organisation.
            </p>
            <div class="space-y-2">
        
              <button
                routerLink="chansons/list"
                class="flex justify-center items-center px-4 py-2 w-full text-indigo-600 bg-indigo-100 rounded-lg transition-colors hover:bg-indigo-200"
              >
                <span class="mr-2 material-icons">queue_music</span>
                Liste des Chansons
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  username: string = '';
  userRole: string = '';

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      const userData = data['userData'] as UserData;
      this.username = userData.username;
      this.userRole = userData.role;
    });
  }
}
