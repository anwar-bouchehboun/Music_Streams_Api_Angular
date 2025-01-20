import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as AudioActions from '../store/actions/audio.actions';
import { AudioState } from '../store/reducers/audio.reducer';
import { take } from 'rxjs/operators';

export interface AudioProgress {
  currentTime: number;
  duration: number;
}

interface SavedAudioState {
  audioId: string;
  currentTime: number;
  volume: number;
}

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private baseUrl = environment.apiUrl;
  private audio: HTMLAudioElement | null = null;
  private currentAudioId: string | null = null;
  private currentTrackId: string | null = null;
  private readonly AUDIO_STATE_KEY = 'audioState';

  private progressSubject = new Subject<AudioProgress>();
  progress$ = this.progressSubject.asObservable();

  private audioEndedSubject = new Subject<void>();
  audioEnded$ = this.audioEndedSubject.asObservable();

  private volumeSubject = new Subject<number>();
  volume$ = this.volumeSubject.asObservable();

  constructor(
    private http: HttpClient,
    private store: Store<{ audio: AudioState }>
  ) {
    this.store
      .select((state) => state.audio.volume)
      .subscribe((volume) => {
        if (this.audio) {
          this.audio.volume = volume;
        }
      });
    this.restoreAudioState();
  }

  streamAudio(audioFileId: string): Observable<Blob> {
    const headers = new HttpHeaders().set('Accept', 'audio/mpeg');
    return this.http.get(
      `${this.baseUrl}/user/chansons/stream/${audioFileId}`,
      {
        responseType: 'blob',
        headers,
      }
    );
  }

  getAudioUrl(audioFileId: string): string {
    return `${this.baseUrl}/user/chansons/stream/${audioFileId}`;
  }

  play(audioFileId: string): Observable<Blob> {
    return new Observable<Blob>((observer) => {
      try {
        console.log('AudioService: Starting playback', audioFileId);

        // Mettre à jour currentTrackId immédiatement
        this.currentTrackId = audioFileId;

        // Si c'est la même chanson, basculer entre play et pause
        if (this.audio && this.currentAudioId === audioFileId) {
          if (this.audio.paused) {
            this.audio.play();
          } else {
            this.audio.pause();
          }
          observer.complete();
          return;
        }

        // Arrêter la musique en cours avant d'en jouer une nouvelle
        if (this.audio) {
          this.audio.pause();
          this.audio.currentTime = 0;
          this.audio.src = '';
          this.audio.load();
          this.currentAudioId = null;
          // Ne pas réinitialiser currentTrackId ici
          this.progressSubject.next({
            currentTime: 0,
            duration: 0,
          });
        }

        const token = localStorage.getItem('token');
        const audioUrl = `${this.baseUrl}/user/chansons/stream/${audioFileId}`;

        if (token) {
          const headers = new Headers();
          headers.append('Authorization', `Bearer ${token}`);
          fetch(new Request(audioUrl, { headers }))
            .then((response) => response.blob())
            .then((blob) => {
              observer.next(blob);
              observer.complete();

              const url = URL.createObjectURL(blob);

              // Créer un nouvel élément audio
              this.audio = new Audio(url);
              this.currentAudioId = audioFileId;
              this.setupAudioEvents();

              // Configurer le volume
              this.store
                .select((state) => state.audio.volume)
                .pipe(take(1))
                .subscribe((volume) => {
                  if (this.audio) {
                    this.audio.volume = volume;
                  }
                });

              // Démarrer la lecture
              this.audio.play().catch((error) => {
                console.error('Erreur lors de la lecture:', error);
                observer.error(error);
              });
            })
            .catch((error) => observer.error(error));
        }
      } catch (error) {
        console.error('Erreur dans la méthode play:', error);
        observer.error(error);
      }
    });
  }

  private setupAudioEvents(): void {
    if (!this.audio) return;

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) {
        const currentTime = this.audio.currentTime || 0;
        const duration = this.audio.duration || 0;

        this.progressSubject.next({
          currentTime,
          duration,
        });

        // Sauvegarder l'état toutes les 5 secondes
        if (Math.floor(currentTime) % 5 === 0) {
          this.saveAudioState();
        }
      }
    });

    this.audio.addEventListener('ended', () => {
      this.audioEndedSubject.next();
      // Ne pas réinitialiser les IDs à la fin de la lecture
      this.audio = null;
      this.progressSubject.next({
        currentTime: 0,
        duration: 0,
      });
    });

    this.audio.addEventListener('volumechange', () => {
      if (this.audio) {
        this.volumeSubject.next(this.audio.volume);
      }
    });
  }

  pause(): void {
    if (this.audio) {
      this.audio.pause();
    }
  }

  private cleanupAudio(): void {
    if (this.audio) {
      // Arrêter la lecture
      this.audio.pause();

      // Réinitialiser la position
      this.audio.currentTime = 0;

      // Supprimer la source
      this.audio.src = '';

      // Forcer le déchargement des ressources
      this.audio.load();

      // Supprimer les événements
      this.audio.onended = null;
      this.audio.ontimeupdate = null;
      this.audio.onvolumechange = null;

      // Libérer l'URL si elle existe
      if (this.audio.src) {
        URL.revokeObjectURL(this.audio.src);
      }

      // Réinitialiser uniquement l'audio, garder la référence de la piste
      this.audio = null;

      // Réinitialiser la progression
      this.progressSubject.next({
        currentTime: 0,
        duration: 0,
      });
    }
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;

      // Ne pas réinitialiser currentTrackId pour garder la référence
      this.audio = null;

      this.progressSubject.next({
        currentTime: 0,
        duration: 0,
      });
    }
  }

  setVolume(volume: number): void {
    const normalizedVolume = Math.max(0, Math.min(1, volume));
    this.store.dispatch(AudioActions.setVolume({ volume: normalizedVolume }));
  }

  toggleMute(): void {
    this.store.dispatch(AudioActions.toggleMute());
  }

  getCurrentAudioId(): string | null {
    return this.currentAudioId;
  }

  getCurrentTrackId(): string | null {
    return this.currentTrackId;
  }

  setAudio(audio: HTMLAudioElement): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.remove();
    }
    this.audio = audio;
  }

  setCurrentTime(time: number): void {
    if (this.audio) {
      this.audio.currentTime = Math.max(0, Math.min(time, this.audio.duration));
      this.progressSubject.next({
        currentTime: this.audio.currentTime,
        duration: this.audio.duration,
      });
    }
  }

  private saveAudioState(): void {
    if (this.audio && this.currentAudioId) {
      const state: SavedAudioState = {
        audioId: this.currentAudioId,
        currentTime: this.audio.currentTime,
        volume: this.audio.volume,
      };
      localStorage.setItem(this.AUDIO_STATE_KEY, JSON.stringify(state));
    }
  }

  private restoreAudioState(): void {
    const savedState = localStorage.getItem(this.AUDIO_STATE_KEY);
    if (savedState) {
      try {
        const state: SavedAudioState = JSON.parse(savedState);
        // Restaurer le volume
        this.store.dispatch(AudioActions.setVolume({ volume: state.volume }));

        // Mettre à jour currentTrackId immédiatement
        this.currentTrackId = state.audioId;
        this.currentAudioId = state.audioId;

        // Restaurer la dernière chanson et sa position de manière plus robuste
        if (state.audioId) {
          const token = localStorage.getItem('token');
          const audioUrl = this.getAudioUrl(state.audioId);

          if (token) {
            const headers = new Headers();
            headers.append('Authorization', `Bearer ${token}`);

            fetch(new Request(audioUrl, { headers }))
              .then((response) => response.blob())
              .then((blob) => {
                const url = URL.createObjectURL(blob);
                this.audio = new Audio(url);
                this.setupAudioEvents();

                // Restaurer le volume et la position
                this.store
                  .select((state) => state.audio.volume)
                  .pipe(take(1))
                  .subscribe((volume) => {
                    if (this.audio) {
                      this.audio.volume = volume;
                      this.audio.currentTime = state.currentTime;
                      // Ne pas démarrer automatiquement la lecture
                      this.progressSubject.next({
                        currentTime: state.currentTime,
                        duration: this.audio.duration,
                      });
                    }
                  });
              })
              .catch((error) => {
                console.error(
                  "Erreur lors de la restauration de l'audio:",
                  error
                );
                this.clearSavedAudioState();
              });
          }
        }
      } catch (error) {
        console.error("Erreur lors de la restauration de l'état audio:", error);
        this.clearSavedAudioState();
      }
    }
  }

  private clearSavedAudioState(): void {
    localStorage.removeItem(this.AUDIO_STATE_KEY);
  }
}
