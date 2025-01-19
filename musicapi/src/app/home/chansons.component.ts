import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

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
import { loadAudio, resumeAudio } from '../store/actions/audio.actions';

@Component({
  selector: 'app-chansons',
  standalone: true,
  imports: [CommonModule, DurationPipe],
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
      <!-- En-tête avec image de fond -->
      <div
        class="relative p-8 mb-8 bg-gradient-to-r from-purple-700 to-indigo-800 rounded-lg shadow-xl overflow-hidden"
        @fadeInOut
      >
        <div class="absolute inset-0 bg-black opacity-20"></div>
        <div class="relative z-10">
          <button
            (click)="retourAccueil()"
            class="flex items-center px-4 py-2 mb-4 text-white bg-white/20 rounded-lg backdrop-blur-sm transition-colors duration-200 hover:bg-white/30"
          >
            <span class="mr-2 material-icons">arrow_back</span>
            Retour
          </button>
          <h1 class="mb-2 text-4xl font-bold text-white">
            {{ albumtitre }}
          </h1>
          <p class="text-purple-200 text-lg">Collection de chansons</p>
        </div>
      </div>

      <ng-container *ngIf="(loading$ | async) === false">
        <div *ngIf="(error$ | async) === null">
          <!-- Liste des chansons -->
          <div
            class="grid gap-6 mb-8"
            [@staggerList]="(chansons$ | async)?.content?.length"
          >
            <div
              *ngFor="
                let chanson of (chansons$ | async)?.content;
                let i = index
              "
              class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
            >
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-6">
                  <div
                    class="flex justify-center items-center w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg transition-transform duration-300 transform hover:scale-110"
                  >
                    <span class="font-medium text-white text-lg">{{
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
                      <span class="text-sm text-gray-500 flex items-center">
                        <span class="material-icons mr-1 text-sm"
                          >schedule</span
                        >
                        {{ chanson.description }}
                      </span>
                      <span class="text-sm text-gray-500 flex items-center">
                        <span class="material-icons mr-1 text-sm"
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
                    class="p-2 rounded-full hover:bg-purple-100 transition-all duration-300 group"
                    [disabled]="!hasPreviousTrack(chanson)"
                  >
                    <span
                      class="material-icons text-gray-400 group-hover:text-purple-600"
                    >
                      skip_previous
                    </span>
                  </button>

                  <!-- Bouton Play/Pause -->
                  <button
                    (click)="onPlayPause(chanson.audioFileId)"
                    class="p-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span class="material-icons text-white text-2xl">
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
                    class="p-2 rounded-full hover:bg-purple-100 transition-all duration-300 group"
                    [disabled]="!hasNextTrack(chanson)"
                  >
                    <span
                      class="material-icons text-gray-400 group-hover:text-purple-600"
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
                    class="p-2 rounded-full hover:bg-red-100 transition-all duration-300 group"
                  >
                    <span
                      class="material-icons text-red-500 group-hover:text-red-600"
                    >
                      stop
                    </span>
                  </button>
                </div>
              </div>

              <!-- Contrôles audio si la piste est active -->
              <div
                *ngIf="(currentAudioId$ | async) === chanson.audioFileId"
                class="mt-6 bg-gray-50 p-4 rounded-xl"
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
                        class="absolute -bottom-6 w-full flex justify-between text-sm text-gray-600"
                      >
                        <span>{{ progress.currentTime | duration }}</span>
                        <span>{{ progress.duration | duration }}</span>
                      </div>
                    </div>
                  </div>
                </ng-container>

                <!-- Contrôle du volume -->
                <div class="flex items-center space-x-4 mt-8">
                  <button
                    (click)="toggleMute()"
                    class="focus:outline-none hover:text-purple-700 transition-colors"
                  >
                    <span class="material-icons text-purple-600">
                      {{ (volume$ | async) === 0 ? 'volume_off' : 'volume_up' }}
                    </span>
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    [value]="(volume$ | async) || 1"
                    (input)="onVolumeChange($event)"
                    class="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination améliorée -->
          <div
            *ngIf="chansons$ | async as paginatedData"
            class="p-6 bg-white rounded-xl shadow-lg"
            @fadeInOut
          >
            <div class="flex justify-between items-center">
              <div class="text-sm font-medium text-gray-600">
                <span
                  class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full"
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
                  class="px-6 py-2 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105 flex items-center"
                >
                  <span class="material-icons mr-2">chevron_left</span>
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
                  class="px-6 py-2 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105 flex items-center"
                >
                  Suivant
                  <span class="material-icons ml-2">chevron_right</span>
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
  }
  loadChansons() {
    this.store.dispatch(
      loadChansons({
        page: this.currentPage,
        size: this.pageSize,
        albumtitre: this.albumtitre!,
      })
    );
  }
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadChansons();
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
    // Arrêter la chanson en cours
    this.store.dispatch(AudioActions.stopAudio());

    this.chansons$.pipe(take(1)).subscribe((paginatedData) => {
      if (paginatedData?.content) {
        const currentIndex = paginatedData.content.findIndex(
          (c: ChansonResponse) => c.audioFileId === currentChanson.audioFileId
        );
        if (currentIndex < paginatedData.content.length - 1) {
          const nextChanson = paginatedData.content[currentIndex + 1];
          // Attendre un court instant pour s'assurer que l'arrêt est effectif
          setTimeout(() => {
            this.onPlayPause(nextChanson.audioFileId);
          }, 100);
        }
      }
    });
  }

  playPrevious(currentChanson: ChansonResponse): void {
    // Arrêter la chanson en cours
    this.store.dispatch(AudioActions.stopAudio());

    this.chansons$.pipe(take(1)).subscribe((paginatedData) => {
      if (paginatedData?.content) {
        const currentIndex = paginatedData.content.findIndex(
          (c: ChansonResponse) => c.audioFileId === currentChanson.audioFileId
        );
        if (currentIndex > 0) {
          const previousChanson = paginatedData.content[currentIndex - 1];
          // Attendre un court instant pour s'assurer que l'arrêt est effectif
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
        hasNext = currentIndex < paginatedData.content.length - 1;
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
        hasPrevious = currentIndex > 0;
      }
    });
    return hasPrevious;
  }
}
