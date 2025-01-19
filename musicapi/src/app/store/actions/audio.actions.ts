import { createAction, props } from '@ngrx/store';

export const playAudio = createAction(
  '[Audio] Play',
  props<{ audioFileId: string }>()
);

export const pauseAudio = createAction('[Audio] Pause');

export const stopAudio = createAction('[Audio] Stop');

export const loadAudio = createAction(
  '[Audio] Load',
  props<{ audioFileId: string }>()
);

export const loadAudioSuccess = createAction(
  '[Audio] Load Success',
  props<{ blob: Blob }>()
);

export const loadAudioFailure = createAction(
  '[Audio] Load Failure',
  props<{ error: any }>()
);

export const setCurrentTime = createAction(
  '[Audio] Set Current Time',
  props<{ currentTime: number }>()
);

export const setDuration = createAction(
  '[Audio] Set Duration',
  props<{ duration: number }>()
);

export const setVolume = createAction(
  '[Audio] Set Volume',
  props<{ volume: number }>()
);

export const updateProgress = createAction(
  '[Audio] Update Progress',
  props<{ currentTime: number; duration: number }>()
);

export const updateVolume = createAction(
  '[Audio] Update Volume',
  props<{ volume: number }>()
);

export const playAudioSuccess = createAction(
  '[Audio] Play Success',
  props<{ audio: HTMLAudioElement }>()
);

export const playAudioFailure = createAction(
  '[Audio] Play Failure',
  props<{ error: any }>()
);

export const resumeAudio = createAction('[Audio] Resume Audio');

export const setMute = createAction(
  '[Audio] Set Mute',
  props<{ isMuted: boolean }>()
);

export const toggleMute = createAction('[Audio] Toggle Mute');
