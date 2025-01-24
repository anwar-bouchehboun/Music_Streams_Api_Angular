import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { User } from '../models/user.model';
import * as AuthActions from '../store/actions/auth.actions';
import {
  selectAuthError,
  selectAuthLoading,
} from '../store/selectors/auth.selectors';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import Swal from 'sweetalert2';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
    MatCheckboxModule,
  ],
  standalone: true,
  selector: 'app-register',
  template: `
    <div class="register-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Inscription</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <!-- Message d'erreur -->

            <!-- Login -->
            <mat-form-field  class="full-width">
              <mat-label>Login</mat-label>
              <input matInput formControlName="login" required />
              <mat-error
                *ngIf="registerForm.get('login')?.hasError('required')"
              >
                Le login est requis
              </mat-error>
              <mat-error
                *ngIf="registerForm.get('login')?.hasError('minlength')"
              >
                Le login doit contenir au moins 3 caractères
              </mat-error>
            </mat-form-field>

            <!-- Mot de passe -->
            <mat-form-field  class="full-width">
              <mat-label>Mot de passe</mat-label>
              <input
                matInput
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
                required
              />
              <button
                mat-icon-button
                matSuffix
                (click)="hidePassword = !hidePassword"
              >
                <mat-icon>{{
                  hidePassword ? 'visibility_off' : 'visibility'
                }}</mat-icon>
              </button>
              <mat-error
                *ngIf="registerForm.get('password')?.hasError('required')"
              >
                Le mot de passe est requis
              </mat-error>
              <mat-error
                *ngIf="registerForm.get('password')?.hasError('minlength')"
              >
                Le mot de passe doit contenir au moins 6 caractères
              </mat-error>
            </mat-form-field>

            <!-- Confirmation du mot de passe -->
            <mat-form-field  class="full-width">
              <mat-label>Confirmer le mot de passe</mat-label>
              <input
                matInput
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="confirmPassword"
                required
              />
              <mat-error *ngIf="registerForm.hasError('mismatch')">
                Les mots de passe ne correspondent pas
              </mat-error>
            </mat-form-field>

            <!-- Sélection des rôles -->
            <div class="roles-section">
              <mat-checkbox formControlName="userRole" checked>Utilisateur</mat-checkbox>
              <mat-checkbox formControlName="adminRole">Administrateur</mat-checkbox>
            </div>

            <!-- Bouton de soumission -->
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="registerForm.invalid || (loading$ | async)"
              class="full-width"
            >
              <mat-spinner diameter="20" *ngIf="loading$ | async"></mat-spinner>
              <span *ngIf="!(loading$ | async)">S'inscrire</span>
            </button>

            <!-- Lien vers la page de connexion -->
            <div class="login-link">
              <a mat-button routerLink="/login"
                >Déjà inscrit ? Connectez-vous</a
              >
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        padding: 16px;
        background-color: #f8f9fe;
      }

      mat-card {
        max-width: 400px;
        width: 100%;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        padding: 24px;
      }

      mat-card-title {
        color: #6c63ff;
        font-size: 24px;
        text-align: center;
        margin-bottom: 24px;
      }

      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }

      ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline {
        background-color: white;
        border-radius: 8px;
      }

      ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline-thick {
        color: #6c63ff;
      }

      button[mat-raised-button] {
        background-color: #6c63ff;
        color: white;
        border-radius: 25px;
        padding: 8px 16px;
        height: 48px;
        font-size: 16px;
      }

      button[mat-raised-button]:disabled {
        background-color: rgba(108, 99, 255, 0.6);
      }

      .error-message {
        color: red;
        margin-bottom: 16px;
        text-align: center;
      }

      .login-link {
        text-align: center;
        margin-top: 16px;
      }

      .roles-section {
        margin-bottom: 16px;
      }

      .roles-section mat-checkbox {
        margin-right: 16px;
      }
    `,
  ],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);
  hidePassword = true;

  constructor(private fb: FormBuilder, private store: Store, private router: Router) {
    this.registerForm = this.fb.group(
      {
        login: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        userRole: [true],
        adminRole: [false]
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {}

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const roleRequests = [];
      if (this.registerForm.value.userRole) {
        roleRequests.push({ rolename: 'USER' });
      }
      if (this.registerForm.value.adminRole) {
        roleRequests.push({ rolename: 'ADMIN' });
      }

      const user: User = {
        login: this.registerForm.value.login,
        password: this.registerForm.value.password,
        roleRequests: roleRequests,
      };
     // console.log(user);

     this.store.dispatch(AuthActions.creatUser({ user }));
     this.router.navigate(['/login']);
     Swal.fire({
      title: 'Succès',
      text: 'Utilisateur créé avec succès',
      icon: 'success',
      timer: 2000
    })
    }
  }
}

