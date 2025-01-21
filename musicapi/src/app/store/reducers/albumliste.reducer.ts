import { createReducer, on } from '@ngrx/store';
import { AlbumListeState, initialAlbumListeState } from '../state/albumliste.state';
import { loadAlbumListeSuccess, loadAlbumListeFailure, loadAlbumListe } from '../actions/albumliste.action';

export const albumListeReducer = createReducer(
  initialAlbumListeState,
  on(loadAlbumListe, (state) => ({ ...state, loading: true })),
  on(loadAlbumListeSuccess, (state, { albums }) => ({ ...state, albums, loading: false })),
  on(loadAlbumListeFailure, (state, { error }) => ({ ...state, error, loading: false }))
);
