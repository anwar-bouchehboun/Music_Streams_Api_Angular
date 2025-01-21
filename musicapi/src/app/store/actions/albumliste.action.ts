import { createAction, props } from '@ngrx/store';
import { Album } from '../../models/album.model';

export const loadAlbumListe = createAction('[AlbumListe] Load AlbumListe');
export const loadAlbumListeSuccess = createAction('[AlbumListe] Load AlbumListe Success', props<{ albums: Album[] }>());
export const loadAlbumListeFailure = createAction('[AlbumListe] Load AlbumListe Failure', props<{ error: string }>());
