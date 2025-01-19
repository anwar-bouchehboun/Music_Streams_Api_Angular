import { createSelector } from '@ngrx/store';
import { AlbumState } from '../state/album.state';
import { AppState } from '../state/app.state';



export const selectAlbumState = (state: AppState) => state.album;

export const selectAlbums = createSelector(selectAlbumState, (state: AlbumState) => state.albums);
export const selectLoading = createSelector(selectAlbumState, (state: AlbumState) => state.loading);
export const selectError = createSelector(selectAlbumState, (state: AlbumState) => state.error);





