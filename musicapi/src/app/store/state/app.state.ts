import { AuthState } from './auth.state';
import { AlbumState } from './album.state';
import { ChansonsState } from './chansons.state';
import { AudioState } from './audio.state';
import { ChansonsListeState } from './chansonsliste.state';
import { AlbumListeState } from './albumliste.state';


export interface AppState {
  auth: AuthState;
  album: AlbumState;
  chansons: ChansonsState;
  audio: AudioState;
  chansonsListe: ChansonsListeState;
  albumListe: AlbumListeState;
}
