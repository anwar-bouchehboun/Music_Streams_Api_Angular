import { createAction, props } from '@ngrx/store';
import { Album } from '../../models/album.model';

export interface PaginatedAlbums {
  content: Album[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const loadAlbums = createAction(
  '[Album] Load Albums',
  props<{ page: number; size: number }>()
);
export const loadAlbumsSuccess = createAction(
  '[Album] Load Albums Success',
  props<{ albums: PaginatedAlbums }>()
);
export const loadAlbumsFailure = createAction(
  '[Album] Load Albums Failure',
  props<{ error: any }>()
);

export const addAlbum = createAction(
  '[Album] Add Album',
  props<{ album: Album }>()
);
export const addAlbumSuccess = createAction(
  '[Album] Add Album Success',
  props<{ album: Album }>()
);
export const addAlbumFailure = createAction(
  '[Album] Add Album Failure',
  props<{ error: any }>()
);

// Delete Album
export const deleteAlbum = createAction(
  '[Album] Delete Album',
  props<{ id: string }>()
);

export const deleteAlbumSuccess = createAction(
  '[Album] Delete Album Success',
  props<{ id: string }>()
);

export const deleteAlbumFailure = createAction(
  '[Album] Delete Album Failure',
  props<{ error: any }>()
);

export const updateAlbum = createAction(
  '[Album] Update Album',
  props<{ album: Album }>()
);
export const updateAlbumSuccess = createAction(
  '[Album] Update Album Success',
  props<{ album: Album }>()
);
export const updateAlbumFailure = createAction(
  '[Album] Update Album Failure',
  props<{ error: any }>()
);

export const getAlbumById = createAction(
  '[Album] Get Album By Id',
  props<{ id: string }>()
);
export const getAlbumByIdSuccess = createAction(
  '[Album] Get Album By Id Success',
  props<{ album: Album }>()
);
export const getAlbumByIdFailure = createAction(
  '[Album] Get Album By Id Failure',
  props<{ error: any }>()
);
export const unloadAlbums = createAction('[Album] Unload Albums');
