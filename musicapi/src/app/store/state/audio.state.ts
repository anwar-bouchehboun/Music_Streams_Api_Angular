export interface AudioState {
  currentAudioId: string | null;
  isPlaying: boolean;
  isStopped: boolean;
  volume: number;
  isMuted: boolean;
  lastVolume: number;
  progress: {
    currentTime: number;
    duration: number;
    percentage: number;
  };
  blob: Blob | null;
  loading: boolean;
  error: any | null;
}

export const initialAudioState: AudioState = {
  currentAudioId: null,
  isPlaying: false,
  isStopped: true,
  volume: 1,
  isMuted: false,
  lastVolume: 1,
  progress: {
    currentTime: 0,
    duration: 0,
    percentage: 0,
  },
  blob: null,
  loading: false,
  error: null,
};
