import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap, take } from 'rxjs/operators';
import { AudioService } from '../../services/audio.service';
import * as AudioActions from '../actions/audio.actions';
import { AppState } from '../state/app.state';

@Injectable()
export class AudioEffects {
  constructor(
    private actions$: Actions,
    private audioService: AudioService,
    private store: Store<AppState>
  ) {}

  loadAudio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AudioActions.loadAudio),
      mergeMap(({ audioFileId }) =>
        this.audioService.streamAudio(audioFileId).pipe(
          map((blob) => AudioActions.loadAudioSuccess({ blob })),
          catchError((error) => of(AudioActions.loadAudioFailure({ error })))
        )
      )
    )
  );

  playAudio$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AudioActions.playAudio),
        tap(({ audioFileId }) => {
          console.log('Effect: Playing audio', audioFileId);
          this.audioService.play(audioFileId).subscribe((blob) => {
            console.log('Blob:', blob);
          });
        })
      ),
    { dispatch: false }
  );

  pauseAudio$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AudioActions.pauseAudio),
        tap(() => {
          console.log('Effect: Pausing audio');
          this.audioService.pause();
        })
      ),
    { dispatch: false }
  );

  stopAudio$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AudioActions.stopAudio),
        tap(() => {
          console.log('Effect: Stopping audio');
          this.audioService.stop();
        })
      ),
    { dispatch: false }
  );

  setVolume$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AudioActions.setVolume),
        tap(({ volume }) => {
          console.log('Effect: Setting volume to', volume);
          this.audioService.setVolume(volume);
        })
      ),
    { dispatch: false }
  );

  audioProgress$ = createEffect(() =>
    this.audioService.progress$.pipe(
      map((progress) => AudioActions.updateProgress(progress))
    )
  );

  audioEnded$ = createEffect(() =>
    this.audioService.audioEnded$.pipe(
      map(() => {
        console.log('Effect: Audio ended');
        return AudioActions.stopAudio();
      })
    )
  );

  trackStatus$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AudioActions.playAudio,
          AudioActions.pauseAudio,
          AudioActions.stopAudio
        ),
        tap((action) => {
          console.log('État de la piste:', {
            type: action.type,
            isPlaying: action.type === AudioActions.playAudio.type,
            currentTrack: this.audioService.getCurrentTrackId(),
          });
        })
      ),
    { dispatch: false }
  );

  setCurrentTime$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AudioActions.setCurrentTime),
        tap(({ currentTime }) => {
          this.audioService.setCurrentTime(currentTime);
        })
      ),
    { dispatch: false }
  );
}
