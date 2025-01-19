import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AudioState } from '../state/audio.state';

export const selectAudioState = createFeatureSelector<AudioState>('audio');

export const selectCurrentAudioId = createSelector(
  selectAudioState,
  (state) => state.currentAudioId
);

export const selectIsPlaying = createSelector(
  selectAudioState,
  (state) => state.isPlaying
);

export const selectCurrentTime = createSelector(
  selectAudioState,
  (state) => state.progress.currentTime
);

export const selectDuration = createSelector(
  selectAudioState,
  (state) => state.progress.duration
);

export const selectVolume = createSelector(
  selectAudioState,
  (state) => state.volume
);

export const selectProgress = createSelector(
  selectAudioState,
  (state) => state.progress
);

export const selectBlob = createSelector(
  selectAudioState,
  (state) => state.blob
);

export const selectError = createSelector(
  selectAudioState,
  (state) => state.error
);

export const selectAudioBlob = createSelector(
  selectAudioState,
  (state) => state.blob
);

export const selectLoading = createSelector(
  selectAudioState,
  (state) => state.loading
);

export const selectIsStopped = createSelector(
  selectAudioState,
  (state) => !state.isPlaying && state.progress.currentTime === 0
);

export const selectIsMuted = createSelector(
  selectAudioState,
  (state) => state.volume === 0
);
