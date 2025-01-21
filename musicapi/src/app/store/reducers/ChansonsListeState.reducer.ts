import { createReducer, on } from '@ngrx/store';
import { initialState } from '../state/chansonsliste.state';
import { getChansonsListe, getChansonsListeSuccess, getChansonsListeFailure } from '../actions/ChansonsListeState.action';

export const chansonsListeReducer = createReducer(
  initialState,
  on(getChansonsListe, (state) => ({ ...state, loading: true })),
  on(getChansonsListeSuccess, (state, { chansons }) => ({ ...state, chansons, loading: false })),
  on(getChansonsListeFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
