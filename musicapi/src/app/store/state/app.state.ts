import { AuthState } from './auth.state';
import { AlbumState } from './album.state';

export interface AppState {
  auth: AuthState;
  album: AlbumState;
}
