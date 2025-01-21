import { createReducer, on } from '@ngrx/store';
import { Album } from '../../models/album.model';
import { initialState } from '../state/album.state';
import {
  loadAlbums,
  loadAlbumsSuccess,
  loadAlbumsFailure,
  addAlbum,
  addAlbumSuccess,
  addAlbumFailure,
  deleteAlbum,
  deleteAlbumSuccess,
  deleteAlbumFailure,
  updateAlbum,
  updateAlbumSuccess,
  updateAlbumFailure,
  unloadAlbums,
  getAlbumByIdSuccess,
  getAlbumByIdFailure,
  getAlbum,
  getAlbumSuccess,
  getAlbumFailure,
} from '../actions/album.action';

export const albumReducer = createReducer(
  initialState,
  //display albums
  on(loadAlbums, (state) => ({ ...state, loading: true, error: null })),
  on(loadAlbumsSuccess, (state, { albums }) => ({
    ...state,
    albums,
    loading: false,
    error: null,
  })),
  on(loadAlbumsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //add album
  on(addAlbum, (state) => ({ ...state, loading: true, error: null })),
  on(addAlbumSuccess, (state, { album }) => ({
    ...state,
    albums: state.albums
      ? {
          ...state.albums,
          content: [...state.albums.content, album],
        }
      : null,
    loading: false,
    error: null,
  })),
  on(addAlbumFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //delete album
  on(deleteAlbum, (state) => ({ ...state, loading: true, error: null })),
  on(deleteAlbumSuccess, (state, { id }) => ({
    ...state,
    albums: state.albums
      ? {
          ...state.albums,
          content: state.albums.content.filter(
            (album: Album) => album.id !== id
          ),
        }
      : null,
    loading: false,
    error: null,
  })),
  on(deleteAlbumFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //update album
  on(updateAlbum, (state) => ({ ...state, loading: true, error: null })),
  on(updateAlbumSuccess, (state, { album }) => ({
    ...state,
    albums: state.albums
      ? {
          ...state.albums,
          content: state.albums.content.map((a: Album) =>
            a.id === album.id ? album : a
          ),
        }
      : null,
    loading: false,
    error: null,
  })),
  on(updateAlbumFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(unloadAlbums, () => ({
    albums: null,
    loading: false,
    error: null,
  })),
  on(getAlbumByIdSuccess, (state, { album }) => ({
    ...state,
    album,
  })),
  on(getAlbumByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(getAlbum, (state) => ({ ...state, loading: true, error: null })),
  on(getAlbumSuccess, (state, { album }) => ({
    ...state,
    album,
    loading: false,
    error: null,
  })),
  on(getAlbumFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),


);
