import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state/app.state';
import * as AuthActions from '../store/actions/auth.actions';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div
      class="flex justify-center items-center p-4 min-h-screen bg-gradient-to-br from-blue-100 to-purple-100"
    >
      <div
        class="p-8 w-full max-w-md bg-white rounded-2xl shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        <h1
          class="mb-8 text-3xl font-normal text-center text-indigo-600 animate-fade-in"
        >
          Login
        </h1>

        <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-6">
          <div class="space-y-1 group">
            <div class="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="absolute left-0 top-2 w-6 h-6 text-gray-400 transition-colors group-hover:text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
              <input
                type="text"
                formControlName="login"
                placeholder="login"
                class="py-2 pr-3 pl-8 w-full border-b-2 border-gray-300 transition-all duration-300 group-hover:border-indigo-500 focus:border-indigo-600 focus:outline-none"
              />
            </div>
            <div
              *ngIf="
                loginForm.get('login')?.touched &&
                loginForm.get('login')?.errors
              "
              class="mt-1 text-sm text-red-500 animate-slide-up"
            >
              <span *ngIf="loginForm.get('login')?.errors?.['required']">
                Le login est requis
              </span>
              <span *ngIf="loginForm.get('login')?.errors?.['minlength']">
                Le login doit contenir au moins 3 caractères
              </span>
              <span *ngIf="loginForm.get('login')?.errors?.['loginNotExist']">
                Le login n'existe pas
              </span>
            </div>
          </div>

          <div class="space-y-1 group">
            <div class="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="absolute left-0 top-2 w-6 h-6 text-gray-400 transition-colors group-hover:text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
                placeholder="Password"
                class="py-2 pr-10 pl-8 w-full border-b-2 border-gray-300 transition-all duration-300 group-hover:border-indigo-500 focus:border-indigo-600 focus:outline-none"
              />
              <button
                type="button"
                (click)="hidePassword = !hidePassword"
                class="absolute top-2 right-2 text-gray-500 transition-colors hover:text-indigo-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    *ngIf="hidePassword"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    *ngIf="hidePassword"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                  <path
                    *ngIf="!hidePassword"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </button>
            </div>
            <div
              *ngIf="
                loginForm.get('password')?.touched &&
                loginForm.get('password')?.errors
              "
              class="mt-1 text-sm text-red-500 animate-slide-up"
            >
              <span *ngIf="loginForm.get('password')?.errors?.['required']"
                >Le mot de passe est requis</span
              >
              <span *ngIf="loginForm.get('password')?.errors?.['minlength']">
                Le mot de passe doit contenir au moins 6 caractères
              </span>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              [disabled]="loginForm.invalid"
              class="px-6 py-2 text-white bg-indigo-600 rounded-lg transition-all duration-200 transform hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              Login
            </button>
          </div>
        </form>
        <div class="mt-4 text-center">
          <a
            [routerLink]="['/register']"
            class="text-indigo-600 hover:text-indigo-700"
          >
            Créer un compte
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slide-up {
        from {
          transform: translateY(10px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .animate-fade-in {
        animation: fade-in 0.5s ease-out;
      }

      .animate-slide-up {
        animation: slide-up 0.3s ease-out;
      }
    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  loginError: string | null = null;

  constructor(private store: Store<AppState>, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.store
      .select((state) => state.auth.error)
      .subscribe((error: any) => {
        if (error) {
          if (error.status === 401) {
            console.log('error', error.message);

            if (error.message === "Le login n'existe pas") {
              this.loginForm.get('login')?.setErrors({ loginNotExist: true });
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: "Le login n'existe pas",
              });
            } else if (error.message === 'Mot de passe incorrect') {
              this.loginForm
                .get('password')
                ?.setErrors({ incorrectPassword: true });
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Mot de passe incorrect',
              });
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Mot de passe incorrect',
            });
          }
        }
      });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { login, password } = this.loginForm.value;
      // Nettoyer les espaces avant et après
      const cleanLogin = login.trim();
      const cleanPassword = password.trim();

      this.store.dispatch(
        AuthActions.login({
          login: cleanLogin,
          password: cleanPassword,
        })
      );
    }
  }
}
