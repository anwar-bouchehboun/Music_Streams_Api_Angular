import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  take,
  filter,
  map,
  distinctUntilChanged,
  debounceTime,
} from 'rxjs/operators';
import { combineLatest, Observable, BehaviorSubject } from 'rxjs';

import { AppState } from '../store/state/app.state';
import { ChansonResponse } from '../models/chanson-response.model';
import { DurationPipe } from '../pipes/duration.pipe';
import { loadChansons, unloadChansons } from '../store/actions/chansons.action';
import * as AudioActions from '../store/actions/audio.actions';
import {
  selectChansons,
  selectError,
  selectLoading,
} from '../store/selectors/chansons.selectors';
import {
  selectCurrentAudioId,
  selectIsPlaying,
  selectProgress,
  selectVolume,
  selectError as selectAudioError,
  selectIsStopped,
  selectIsMuted,
} from '../store/selectors/audio.selectors';
import { PageEvent } from '@angular/material/paginator';
import {
  trigger,
  transition,
  style,
  animate,
  stagger,
  query,
} from '@angular/animations';
import { FormsModule } from '@angular/forms';

interface PaginatedChansons {
  content: ChansonResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Component({
  selector: 'app-chansons',
  standalone: true,
  imports: [CommonModule, DurationPipe, FormsModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '0.3s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('staggerList', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger('100ms', [
              animate(
                '0.3s ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
  template: `
    <div class="container p-6 mx-auto" @fadeInOut>
      <!-- En-tête avec image de fond et barre de recherche -->
      <div
        class="overflow-hidden relative p-8 mb-8 bg-gradient-to-r from-purple-700 to-indigo-800 rounded-lg shadow-xl"
        @fadeInOut
      >
        <div class="absolute inset-0 bg-black opacity-20"></div>
        <div class="relative z-10">
          <button
            (click)="retourAccueil()"
            class="flex items-center px-4 py-2 mb-4 text-white rounded-lg backdrop-blur-sm transition-colors duration-200 bg-white/20 hover:bg-white/30"
          >
            <span class="mr-2 material-icons">arrow_back</span>
            Retour
          </button>
          <h1 class="mb-4 text-4xl font-bold text-white">
            {{ albumtitre }}
          </h1>
          <!-- Barre de recherche -->
          <div class="relative max-w-md">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearch($event)"
              placeholder="Rechercher une chanson..."
              class="px-4 py-2 pl-10 w-full text-gray-700 rounded-lg backdrop-blur-sm bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span class="absolute left-3 top-2.5 text-gray-400 material-icons"
              >search</span
            >
          </div>
        </div>
      </div>

      <ng-container *ngIf="(loading$ | async) === false">
        <div *ngIf="(error$ | async) === null">
          <!-- Liste des chansons -->
          <div
            class="grid gap-6 mb-8"
            [@staggerList]="(filteredChansons$ | async)?.content?.length"
          >
            <div
              *ngFor="
                let chanson of (filteredChansons$ | async)?.content;
                let i = index
              "
              class="p-6 bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-6">
                  <div
                    class="flex justify-center items-center w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg transition-transform duration-300 transform hover:scale-110"
                  >
                    <span class="text-lg font-medium text-white">{{
                      chanson.trackNumber
                    }}</span>
                  </div>
                  <div class="flex-grow">
                    <h3 class="text-xl font-bold text-gray-800">
                      {{ chanson.titre }}
                    </h3>
                    <div class="flex flex-wrap gap-3 mt-2">
                      <span
                        class="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full"
                      >
                        {{ chanson.categorie }}
                      </span>
                      <span class="flex items-center text-sm text-gray-500">
                        <span class="mr-1 text-sm material-icons"
                          >schedule</span
                        >
                        {{ chanson.description }}
                      </span>
                      <span class="flex items-center text-sm text-gray-500">
                        <span class="mr-1 text-sm material-icons"
                          >calendar_today</span
                        >
                        {{ chanson.dateAjout | date : 'dd/MM/yyyy' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Contrôles de lecture -->
                <div class="flex items-center space-x-4">
                  <!-- Bouton Précédent -->
                  <button
                    *ngIf="(currentAudioId$ | async) === chanson.audioFileId"
                    (click)="playPrevious(chanson)"
                    class="p-2 rounded-full transition-all duration-300 hover:bg-purple-100 group"
                    [disabled]="!hasPreviousTrack(chanson)"
                  >
                    <span
                      class="text-gray-400 material-icons group-hover:text-purple-600"
                    >
                      skip_previous
                    </span>
                  </button>

                  <!-- Bouton Play/Pause -->
                  <button
                    (click)="onPlayPause(chanson.audioFileId)"
                    class="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg transition-all duration-300 transform hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl hover:scale-105"
                  >
                    <span class="text-2xl text-white material-icons">
                      {{
                        (currentAudioId$ | async) === chanson.audioFileId &&
                        (isPlaying$ | async)
                          ? 'pause'
                          : 'play_arrow'
                      }}
                    </span>
                  </button>

                  <!-- Bouton Suivant -->
                  <button
                    *ngIf="(currentAudioId$ | async) === chanson.audioFileId"
                    (click)="playNext(chanson)"
                    class="p-2 rounded-full transition-all duration-300 hover:bg-purple-100 group"
                    [disabled]="!hasNextTrack(chanson)"
                  >
                    <span
                      class="text-gray-400 material-icons group-hover:text-purple-600"
                    >
                      skip_next
                    </span>
                  </button>

                  <!-- Bouton Stop -->
                  <button
                    *ngIf="
                      (currentAudioId$ | async) === chanson.audioFileId &&
                      !(isStopped$ | async)
                    "
                    (click)="onStop()"
                    class="p-2 rounded-full transition-all duration-300 hover:bg-red-100 group"
                  >
                    <span
                      class="text-red-500 material-icons group-hover:text-red-600"
                    >
                      stop
                    </span>
                  </button>
                </div>
              </div>

              <!-- Contrôles audio si la piste est active -->
              <div
                *ngIf="(currentAudioId$ | async) === chanson.audioFileId"
                class="p-4 mt-6 bg-gray-50 rounded-xl"
              >
                <ng-container *ngIf="progress$ | async as progress">
                  <div class="space-y-2">
                    <div class="relative">
                      <input
                        type="range"
                        [value]="progress.currentTime"
                        [max]="progress.duration"
                        (input)="onProgressChange($event)"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <div
                        class="flex absolute -bottom-6 justify-between w-full text-sm text-gray-600"
                      >
                        <span>{{ progress.currentTime | duration }}</span>
                        <span>{{ progress.duration | duration }}</span>
                      </div>
                    </div>
                  </div>
                </ng-container>

                <!-- Contrôle du volume -->
                <div class="flex items-center mt-8 space-x-4">
                  <button
                    (click)="toggleMute()"
                    class="transition-colors focus:outline-none hover:text-purple-700"
                  >
                    <span class="text-purple-600 material-icons">
                      {{ (volume$ | async) === 0 ? 'volume_off' : 'volume_up' }}
                    </span>
                  </button>
                  <!--     [value]="(volume$ | async) ||1 "
                    -->

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    [value]="volume$ | async"
                    (input)="onVolumeChange($event)"
                    class="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination améliorée -->
          <div
            *ngIf="filteredChansons$ | async as paginatedData"
            class="p-6 bg-white rounded-xl shadow-lg"
            @fadeInOut
          >
            <div class="flex justify-between items-center">
              <div class="text-sm font-medium text-gray-600">
                <span
                  class="px-3 py-1 text-purple-700 bg-purple-100 rounded-full"
                >
                  Page {{ paginatedData.number + 1 }} sur
                  {{ paginatedData.totalPages || 1 }}
                </span>
                <span class="mx-3 text-gray-400">•</span>
                <span>{{ paginatedData.totalElements }} chansons</span>
              </div>

              <div class="flex space-x-4">
                <button
                  [disabled]="
                    paginatedData.number === 0 ||
                    paginatedData.totalElements === 0
                  "
                  (click)="
                    onPageChange({
                      pageIndex: paginatedData.number - 1,
                      pageSize: paginatedData.size,
                      length: paginatedData.totalElements
                    })
                  "
                  class="flex items-center px-6 py-2 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md transition-all duration-300 transform hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105"
                >
                  <span class="mr-2 material-icons">chevron_left</span>
                  Précédent
                </button>
                <button
                  [disabled]="
                    paginatedData.number + 1 === paginatedData.totalPages ||
                    paginatedData.totalElements === 0
                  "
                  (click)="
                    onPageChange({
                      pageIndex: paginatedData.number + 1,
                      pageSize: paginatedData.size,
                      length: paginatedData.totalElements
                    })
                  "
                  class="flex items-center px-6 py-2 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md transition-all duration-300 transform hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105"
                >
                  Suivant
                  <span class="ml-2 material-icons">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Message d'erreur -->
        <div
          *ngIf="error$ | async as error"
          class="relative px-4 py-3 text-red-700 bg-red-100 rounded border border-red-400"
        >
          <p>{{ error }}</p>
          <button
            (click)="retryLoading()"
            class="px-4 py-2 mt-2 text-white bg-red-600 rounded-md transition-colors duration-200 hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </ng-container>

      <!-- Loading spinner -->
      <div
        *ngIf="loading$ | async"
        class="flex justify-center items-center p-8"
        @fadeInOut
      >
        <div
          class="w-12 h-12 rounded-full border-4 border-purple-600 animate-spin border-t-transparent"
        ></div>
      </div>
    </div>
  `,
})
export class ChansonsComponent implements OnInit, OnDestroy {
  albumtitre: string | null = null;
  chansons: ChansonResponse[] = [];
  chansons$ = this.store.select(selectChansons);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  progress$ = this.store.select(selectProgress);
  isPlaying$ = this.store.select(selectIsPlaying);
  isStopped$ = this.store.select(selectIsStopped);
  currentAudioId$ = this.store.select(selectCurrentAudioId);
  volume$ = this.store.select(selectVolume);
  isMuted$ = this.store.select(selectIsMuted);
  isMuted = false;
  previousVolume = 0;

  currentPage = 0;
  pageSize = 4;
  currentAudioId: string | null = null;
  searchTerm = '';

  private searchTerms = new BehaviorSubject<string>('');

  filteredChansons$: Observable<PaginatedChansons | null> = combineLatest([
    this.chansons$,
    this.searchTerms
      .asObservable()
      .pipe(debounceTime(300), distinctUntilChanged()),
  ]).pipe(
    map(([paginatedData, search]) => {
      if (!paginatedData || !paginatedData.content) return paginatedData;

      const searchLower = search.toLowerCase().trim();

      if (!searchLower) return paginatedData;

      const filteredContent = paginatedData.content.filter(
        (chanson) =>
          chanson.titre.toLowerCase().includes(searchLower) ||
          chanson.description.toLowerCase().includes(searchLower) ||
          chanson.categorie.toLowerCase().includes(searchLower)
      );

      console.log('Résultats filtrés:', {
        recherche: searchLower,
        total: filteredContent.length,
        résultats: filteredContent,
      });

      return {
        ...paginatedData,
        content: filteredContent,
        totalElements: filteredContent.length,
        totalPages: Math.ceil(filteredContent.length / this.pageSize),
        number: 0,
      };
    })
  );

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit() {
    this.albumtitre = this.route.snapshot.paramMap.get('titre');
    if (this.albumtitre) {
      this.loadChansons();
    }

    // Modification de la souscription pour stocker correctement les données
    this.chansons$
      .pipe(
        filter((data) => !!data) // Filtrer les valeurs null/undefined
      )
      .subscribe((paginatedData) => {
        if (paginatedData && paginatedData.content) {
          this.chansons = [...paginatedData.content];
          console.log('Chansons chargées:', this.chansons);
        }
      });

    // S'abonner aux changements des résultats filtrés
    this.filteredChansons$.subscribe((results) => {
      console.log('Mise à jour des résultats:', results);
    });
  }

  loadChansons() {
    this.store.dispatch(
      loadChansons({
        page: this.currentPage,
        size: this.pageSize,
        albumtitre: this.albumtitre!,
        searchTerm: this.searchTerms.getValue(),
      })
    );
  }

  onSearch(searchValue: string): void {
    console.log('Nouvelle recherche:', searchValue);
    this.searchTerms.next(searchValue);
    this.currentPage = 0;
  }

  onPageChange(event: PageEvent) {
    // Arrêter la lecture audio en cours lors du changement de page
    this.store.dispatch(AudioActions.stopAudio());

    // Attendre un bref instant pour s'assurer que l'audio est arrêté
    setTimeout(() => {
      this.currentPage = event.pageIndex;
      this.pageSize = event.pageSize;
      this.loadChansons();
    }, 100);
  }

  retryLoading() {
    console.log('retryLoading');
    this.loadChansons();
  }

  ngOnDestroy() {
    this.store.dispatch(unloadChansons());
    this.store.dispatch(AudioActions.stopAudio());
  }

  retourAccueil() {
    this.router.navigate(['/home']);
  }

  onPlayPause(audioFileId: string): void {
    console.log('Component: Play/Pause clicked', audioFileId);
    this.store.dispatch(AudioActions.playAudio({ audioFileId }));
  }

  onProgressChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const time = parseFloat(input.value);
    if (!isNaN(time)) {
      // Mettre à jour l'état dans le store
      this.store.dispatch(AudioActions.setCurrentTime({ currentTime: time }));

      // Mettre à jour la position de lecture dans l'audio
      this.store
        .select(selectCurrentAudioId)
        .pipe(take(1))
        .subscribe((audioId) => {
          if (audioId) {
            this.store.dispatch(
              AudioActions.updateProgress({
                currentTime: time,
                duration: parseFloat(input.max) || 0,
              })
            );
          }
        });
    }
  }

  onVolumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const volume = parseFloat(input.value);
    console.log('Volume:', volume);
    if (!isNaN(volume)) {
      this.store.dispatch(AudioActions.updateVolume({ volume }));
    }
  }

  onStop(): void {
    this.store.dispatch(AudioActions.stopAudio());
  }

  toggleMute(): void {
    this.store.dispatch(AudioActions.toggleMute());

    this.volume$.pipe(take(1)).subscribe((currentVolume) => {
      if (currentVolume === 0) {
        this.store.dispatch(AudioActions.toggleMute());
      } else {
        this.previousVolume = currentVolume;
      }
    });
  }

  playNext(currentChanson: ChansonResponse): void {
    this.chansons$.pipe(take(1)).subscribe((paginatedData) => {
      if (paginatedData?.content) {
        const currentIndex = paginatedData.content.findIndex(
          (c: ChansonResponse) => c.audioFileId === currentChanson.audioFileId
        );

        // Vérifier si nous sommes à la dernière chanson de la page actuelle
        if (currentIndex === paginatedData.content.length - 1) {
          // S'il y a une page suivante
          if (paginatedData.number < paginatedData.totalPages - 1) {
            this.store.dispatch(AudioActions.stopAudio());
            this.onPageChange({
              pageIndex: this.currentPage + 1,
              pageSize: this.pageSize,
              length: paginatedData.totalElements,
            });
          }
        } else if (currentIndex < paginatedData.content.length - 1) {
          // Lecture normale de la chanson suivante
          const nextChanson = paginatedData.content[currentIndex + 1];
          this.store.dispatch(AudioActions.stopAudio());
          setTimeout(() => {
            this.onPlayPause(nextChanson.audioFileId);
          }, 100);
        }
      }
    });
  }

  playPrevious(currentChanson: ChansonResponse): void {
    this.chansons$.pipe(take(1)).subscribe((paginatedData) => {
      if (paginatedData?.content) {
        const currentIndex = paginatedData.content.findIndex(
          (c: ChansonResponse) => c.audioFileId === currentChanson.audioFileId
        );

        // Vérifier si nous sommes à la première chanson de la page actuelle
        if (currentIndex === 0) {
          // S'il y a une page précédente
          if (paginatedData.number > 0) {
            this.store.dispatch(AudioActions.stopAudio());
            this.onPageChange({
              pageIndex: this.currentPage - 1,
              pageSize: this.pageSize,
              length: paginatedData.totalElements,
            });
          }
        } else if (currentIndex > 0) {
          // Lecture normale de la chanson précédente
          const previousChanson = paginatedData.content[currentIndex - 1];
          this.store.dispatch(AudioActions.stopAudio());
          setTimeout(() => {
            this.onPlayPause(previousChanson.audioFileId);
          }, 100);
        }
      }
    });
  }

  hasNextTrack(currentChanson: ChansonResponse): boolean {
    let hasNext = false;
    this.chansons$.pipe(take(1)).subscribe((paginatedData) => {
      if (paginatedData?.content) {
        const currentIndex = paginatedData.content.findIndex(
          (c: ChansonResponse) => c.audioFileId === currentChanson.audioFileId
        );
        // Vérifier s'il y a une chanson suivante sur la page actuelle ou une page suivante
        hasNext =
          currentIndex < paginatedData.content.length - 1 ||
          paginatedData.number < paginatedData.totalPages - 1;
      }
    });
    return hasNext;
  }

  hasPreviousTrack(currentChanson: ChansonResponse): boolean {
    let hasPrevious = false;
    this.chansons$.pipe(take(1)).subscribe((paginatedData) => {
      if (paginatedData?.content) {
        const currentIndex = paginatedData.content.findIndex(
          (c: ChansonResponse) => c.audioFileId === currentChanson.audioFileId
        );
        // Vérifier s'il y a une chanson précédente sur la page actuelle ou une page précédente
        hasPrevious = currentIndex > 0 || paginatedData.number > 0;
      }
    });
    return hasPrevious;
  }
}
