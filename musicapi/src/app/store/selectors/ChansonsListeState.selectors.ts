import { createSelector } from '@ngrx/store';
import { ChansonsListeState } from '../state/chansonsliste.state';
import { AppState } from '../state/app.state';

export const selectChansonsListeState = (state: AppState) => state.chansonsListe;

export const selectChansonsListe = createSelector(selectChansonsListeState, (state: ChansonsListeState) => state.chansons);
export const selectLoading = createSelector(selectChansonsListeState, (state: ChansonsListeState) => state.loading);
export const selectError = createSelector(selectChansonsListeState, (state: ChansonsListeState) => state.error);

