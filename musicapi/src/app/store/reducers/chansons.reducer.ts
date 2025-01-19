import { createReducer, on } from '@ngrx/store';
import { ChansonResponse } from '../../models/chanson-response.model';
import { initialState } from '../state/chansons.state';
import {
  loadChansons,
  loadChansonsSuccess,
  loadChansonsFailure,
  addChanson,
  addChansonSuccess,
  addChansonFailure,
  deleteChanson,
  deleteChansonSuccess,
  deleteChansonFailure,
  updateChanson,
  updateChansonSuccess,
  updateChansonFailure,
  unloadChansons,
} from '../actions/chansons.action';

export const chansonsReducer = createReducer(
  initialState,
  // Load chansons
  on(loadChansons, (state) => ({ ...state, loading: true, error: null })),
  on(loadChansonsSuccess, (state, { chansons }) => ({
    ...state,
    chansons,
    loading: false,
    error: null,
  })),
  on(loadChansonsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add chanson
  on(addChanson, (state) => ({ ...state, loading: true, error: null })),
  on(addChansonSuccess, (state, { chanson }) => ({
    ...state,
    chansons: state.chansons
      ? {
          ...state.chansons,
          content: [...state.chansons.content, chanson],
        }
      : null,
    loading: false,
    error: null,
  })),
  on(addChansonFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete chanson
  on(deleteChanson, (state) => ({ ...state, loading: true, error: null })),
  on(deleteChansonSuccess, (state, { id }) => ({
    ...state,
    chansons: state.chansons
      ? {
          ...state.chansons,
          content: state.chansons.content.filter(
            (chanson: ChansonResponse) => chanson.id !== id
          ),
        }
      : null,
    loading: false,
    error: null,
  })),
  on(deleteChansonFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update chanson
  on(updateChanson, (state) => ({ ...state, loading: true, error: null })),
  on(updateChansonSuccess, (state, { chanson }) => ({
    ...state,
    chansons: state.chansons
      ? {
          ...state.chansons,
          content: state.chansons.content.map((c: ChansonResponse) =>
            c.id === chanson.id ? chanson : c
          ),
        }
      : null,
    loading: false,
    error: null,
  })),
  on(updateChansonFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(unloadChansons, () => ({
    chansons: null,
    loading: false,
    error: null,
  }))
);
