import { createSelector } from '@ngrx/store';
import { AlbumState } from '../state/album.state';
import { AppState } from '../state/app.state';
import { Album } from '../../models/album.model';

interface AlbumPage {
  content: Album[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const selectAlbumState = (state: AppState) => state.album;

export const selectAlbums = createSelector(
  selectAlbumState,
  (state: AlbumState) => state.albums
);
export const selectLoading = createSelector(
  selectAlbumState,
  (state: AlbumState) => state.loading
);
export const selectError = createSelector(
  selectAlbumState,
  (state: AlbumState) => state.error
);

export const selectAlbumById = (id: string) =>
  createSelector(selectAlbums, (albums: AlbumPage | null) => {
    if (albums?.content) {
      return (
        albums.content.find((album: Album) => album.id && album.id === id) ||
        null
      );
    }
    return null;
  });

  export const selectAlbum = createSelector(
    selectAlbumState,
    (state: AlbumState) => state.albums
  );
  export const selectAlbumLoading = createSelector(
    selectAlbumState,
    (state: AlbumState) => state.loading
  );
  export const selectAlbumError = createSelector(
    selectAlbumState,
    (state: AlbumState) => state.error
  );

