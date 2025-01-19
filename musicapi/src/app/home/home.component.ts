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
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="p-6 bg-white">
      <div class="mx-auto max-w-7xl">
        <h1 class="mb-6 text-3xl font-bold text-blue-900">
          Bienvenue sur la page d'accueil
        </h1>

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

          <div *ngIf="albums$ | async as albums" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div
                *ngFor="let album of albums.content"
                class="p-4 bg-gray-100 rounded-lg border shadow"
              >
                <h2 class="text-xl font-semibold">{{ album.titre }}</h2>
                <p class="text-blue-600">{{ album.artiste }}</p>
                <div class="flex justify-between">
                  <p class="text-gray-600">{{ album.annee }}</p>
                  <button
                    [routerLink]="['chansons', album.titre]"
                    class="px-2 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    Chansons
                  </button>
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
  albums$ = this.store.select(selectAlbums);
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
  pageSize = 4;

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit() {
    this.loadAlbums();
  }

  loadAlbums() {
    console.log('📥 Demande de chargement des albums:', {
      page: this.currentPage,
      size: this.pageSize,
    });
    this.store.dispatch(
      loadAlbums({ page: this.currentPage, size: this.pageSize })
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
}
