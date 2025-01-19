import { createReducer, on } from '@ngrx/store';
import * as AudioActions from '../actions/audio.actions';
import { initialAudioState } from '../state/audio.state';

export interface AudioState {
  currentAudioId: string;
  isPlaying: boolean;
  progress: {
    currentTime: number;
    duration: number;
    percentage: number;
  };
  audioBlob: Blob | null;
  loading: boolean;
  error: string | null;
  volume: number;
  isMuted: boolean;
  previousVolume?: number;
}

export const initialState: AudioState = {
  currentAudioId: '',
  isPlaying: false,
  progress: {
    currentTime: 0,
    duration: 0,
    percentage: 0,
  },
  audioBlob: null,
  loading: false,
  error: null,
  volume: 1,
  isMuted: false,
};

export const audioReducer = createReducer(
  initialState,

  on(AudioActions.playAudio, (state, { audioFileId }) => ({
    ...state,
    currentAudioId: audioFileId,
    loading: true,
    error: null,
  })),

  on(AudioActions.playAudioSuccess, (state) => ({
    ...state,
    isPlaying: true,
    loading: false,
  })),

  on(AudioActions.playAudioFailure, (state, { error }) => ({
    ...state,
    isPlaying: false,
    loading: false,
    error,
  })),

  on(AudioActions.pauseAudio, (state) => ({
    ...state,
    isPlaying: false,
  })),

  on(AudioActions.stopAudio, (state) => ({
    ...state,
    isPlaying: false,
    progress: {
      currentTime: 0,
      duration: 0,
      percentage: 0,
    },
  })),

  on(AudioActions.loadAudio, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AudioActions.loadAudioSuccess, (state, { blob }) => ({
    ...state,
    audioBlob: blob,
    loading: false,
  })),

  on(AudioActions.loadAudioFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(AudioActions.setCurrentTime, (state, { currentTime }) => ({
    ...state,
    progress: {
      ...state.progress,
      currentTime,
    },
  })),

  on(AudioActions.setDuration, (state, { duration }) => ({
    ...state,
    progress: {
      ...state.progress,
      duration,
    },
  })),

  on(AudioActions.setVolume, (state, { volume }) => ({
    ...state,
    volume: volume,
    isMuted: volume === 0,
    previousVolume: volume === 0 ? state.previousVolume : volume,
  })),

  on(AudioActions.updateProgress, (state, { currentTime, duration }) => ({
    ...state,
    progress: {
      currentTime,
      duration,
      percentage: (currentTime / duration) * 100,
    },
  })),

  on(AudioActions.updateVolume, (state, { volume }) => ({
    ...state,
    volume: Math.max(0, Math.min(1, volume)),
  })),

  on(AudioActions.resumeAudio, (state) => ({
    ...state,
    isPlaying: true,
  })),

  on(AudioActions.setMute, (state, { isMuted }) => ({
    ...state,
    isMuted,
    previousVolume: isMuted ? state.volume : state.previousVolume,
    volume: isMuted ? 0 : state.previousVolume || 1,
  })),

  on(AudioActions.toggleMute, (state) => ({
    ...state,
    isMuted: !state.isMuted,
    previousVolume: state.isMuted ? state.previousVolume : state.volume,
    volume: state.isMuted ? state.previousVolume || 1 : 0,
  }))
);
