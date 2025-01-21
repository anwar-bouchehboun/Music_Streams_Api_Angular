import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/state/app.state';
import * as AuthActions from '../../store/actions/auth.actions';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo et Navigation -->
          <div class="flex">
            <div class="flex flex-shrink-0 items-center">
              <img
                class="w-auto h-10 rounded-full filter drop-shadow-lg transition-all duration-200 cursor-pointer hover:drop-shadow-xl"
                src="assets/music.png"
                alt="Logo"
              />
            </div>

            <!-- Navigation Desktop -->
            <div class="hidden md:ml-8 md:flex md:space-x-6">
              <ng-container *ngIf="isAuthenticated">
                <!-- Liens communs -->
                <!-- Liens User -->
                <a
                  routerLink="/home"
                  routerLinkActive="bg-white/20 text-white"
                  class="flex items-center px-4 py-2 space-x-2 text-sm font-medium rounded-md transition-all duration-200 text-white/90 hover:bg-white/20 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>Accueil</span>
                </a>

                <!-- Liens Admin -->
                <ng-container *ngIf="isAdmin">
                  <a
                    routerLink="/dashboard"
                    routerLinkActive="bg-white/20 text-white"
                    class="flex items-center px-4 py-2 space-x-2 text-sm font-medium rounded-md transition-all duration-200 text-white/90 hover:bg-white/20 hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <span>Dashboard</span>
                  </a>
                </ng-container>
              </ng-container>
            </div>
          </div>

          <div class="flex items-center">
            <ng-container *ngIf="isAuthenticated">
              <div class="flex items-center space-x-4">
                <div
                  class="flex items-center px-4 py-2 space-x-3 rounded-lg bg-white/10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 text-white/90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span class="text-sm font-medium text-white/90">{{
                    username
                  }}</span>
                </div>

                <button
                  (click)="logout()"
                  class="flex items-center px-4 py-2 space-x-2 text-white rounded-lg transition-all duration-200 bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-indigo-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span class="text-sm font-medium">Déconnexion</span>
                </button>
              </div>
            </ng-container>
          </div>
        </div>
      </div>

      <!-- Menu Mobile -->
      <div class="md:hidden" [class.hidden]="!isMobileMenuOpen">
        <div class="px-2 pt-2 pb-3 m-2 space-y-1 rounded-lg bg-white/10">
          <ng-container *ngIf="isAuthenticated">
            <a
              routerLink="/home"
              routerLinkActive="bg-white/20 text-white"
              class="flex items-center px-3 py-2 space-x-2 text-base font-medium rounded-md transition-all duration-200 text-white/90 hover:bg-white/20 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Accueil</span>
            </a>

            <ng-container *ngIf="isAdmin">
              <a
                routerLink="/dashboard"
                routerLinkActive="bg-white/20 text-white"
                class="flex items-center px-3 py-2 space-x-2 text-base font-medium rounded-md transition-all duration-200 text-white/90 hover:bg-white/20 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>Dashboard</span>
              </a>
            </ng-container>
          </ng-container>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  isAdmin = false;
  username: string | null = null;
  isMobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit() {
    this.updateNavbarState();
  }

  private updateNavbarState() {
    const token = this.authService.getDecodedToken();
    if (token) {
      this.isAuthenticated = true;
      this.username = token.sub;
      this.isAdmin = token.role.includes('ADMIN');
    }
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/login']);

  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
