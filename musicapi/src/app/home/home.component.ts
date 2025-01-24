import { ChansonResponse } from './../models/chanson-response.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe, NgFor, NgIf } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { AppState } from '../store/state/app.state';
import { Store } from '@ngrx/store';
import { loadAlbums, unloadAlbums } from '../store/actions/album.action';
import {
  selectAlbums,
  selectLoading,
  selectError,
} from '../store/selectors/album.selectors';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { delay, tap } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    AsyncPipe,
    NgFor,
    NgIf,
    MatPaginatorModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="p-6 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div class="mx-auto max-w-7xl">
        <h1 class="mb-6 text-3xl font-bold text-blue-900">
          Bienvenue sur la page d'accueil
        </h1>

        <div class="flex justify-center py-2 mb-6">
          <div class="relative py-1 w-64">
            <div
              class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
            >
              <svg
                class="w-5 h-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              [formControl]="searchControl"
              type="text"
              placeholder="Rechercher un album..."
              class="py-4 pr-10 pl-10 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              *ngIf="searchControl.value"
              (click)="restSerch()"
              class="flex absolute inset-y-0 right-0 items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <svg
                class="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <ng-container *ngIf="!(error$ | async)">
          <div
            *ngIf="loading$ | async"
            class="flex justify-center items-center p-12"
          >
            <div class="flex gap-4 items-center p-8 bg-white rounded-lg shadow">
              <div
                class="w-16 h-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"
              ></div>
              <p class="text-lg text-gray-600">Chargement en cours...</p>
            </div>
          </div>

          <div *ngIf="albums$ | async as albums" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div
                *ngFor="let album of albums.content"
                class="overflow-hidden bg-white rounded-xl shadow-lg transition-all duration-300 transform group hover:scale-105 hover:shadow-xl"
              >
                <div class="overflow-hidden relative h-48">
                  <img
                    [src]="'assets/music.png'"
                    [alt]="album.titre"
                    class="object-cover w-full h-full transition-transform duration-300 transform group-hover:scale-110"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 from-black/60 group-hover:opacity-100"
                  ></div>
                </div>
                <div class="p-5">
                  <h2 class="mb-2 text-xl font-bold text-gray-800">
                    {{ album.titre }}
                  </h2>
                  <div class="flex gap-3 items-center my-2 j">
                    <img
                      src="assets/artiste.jpg"
                      alt="Artiste icon"
                      class="object-cover w-8 h-8 rounded-full border-2 border-blue-500"
                    />
                    <p class="font-medium text-blue-600">{{ album.artiste }}</p>
                  </div>
                  <div class="flex justify-between items-center">
                    <p class="text-gray-600">{{ album.annee }}</p>
                    <button
                      [routerLink]="['chansons', album.titre]"
                      class="px-4 py-2 text-white bg-blue-500 rounded-lg transition-all duration-300 transform hover:bg-blue-600 hover:scale-105 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                    >
                      Voir les chansons
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <mat-paginator
              [length]="albums?.totalElements"
              [pageSize]="pageSize"
              [pageSizeOptions]="[4, 8, 12]"
              [pageIndex]="currentPage"
              (page)="onPageChange($event)"
              aria-label="Sélectionner la page"
              class="rounded-lg shadow"
            >
            </mat-paginator>
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit, OnDestroy {
  albums$ = this.store.select(selectAlbums).pipe(
    tap((response) => {
      console.log('🔍 Structure de la réponse albums:', {
        response,
        content: response?.content,
        totalElements: response?.totalElements,
      });
    })
  );
  loading$ = this.store.select(selectLoading).pipe(
    tap((loading) => {
      if (loading) {
        console.log('🔄 Chargement des albums en cours...');
      } else {
        console.log('✅ Chargement des albums terminé');
      }
    })
  );
  error$ = this.store.select(selectError);

  currentPage = 0;
  pageSize = 6;
  searchControl = new FormControl('');

  constructor(private store: Store<AppState>, private router: Router) {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.currentPage = 0;
        const queryParams = value ? { search: value } : {};
        this.router.navigate([], {
          relativeTo: this.router.routerState.root,
          queryParams,
          queryParamsHandling: 'merge',
        });
        this.loadAlbums();
      });
  }

  ngOnInit() {
    const searchParams = new URLSearchParams(window.location.search);
    const searchParam = searchParams.get('search');
    console.log('searchParam', searchParam);
    if (searchParam) {
      this.searchControl.setValue(searchParam, { emitEvent: false });
      console.log('searchParam', searchParam);
    }
    this.loadAlbums();
  }

  loadAlbums() {
    const searchTerm = this.searchControl.value;
    console.log('📥 Demande de chargement des albums:', {
      page: this.currentPage,
      size: this.pageSize,
      search: searchTerm,
    });
    this.store.dispatch(
      loadAlbums({
        page: this.currentPage,
        size: this.pageSize,
        search: searchTerm?.trim() || '',
      })
    );
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAlbums();
  }

  retryLoading() {
    console.log('retryLoading');
    this.loadAlbums();
  }
  ngOnDestroy() {
    this.store.dispatch(unloadAlbums());
  }
  restSerch() {
    this.searchControl.setValue('');
    this.router.navigate(['/home']);
  }
}
