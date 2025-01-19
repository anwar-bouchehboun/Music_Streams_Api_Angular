import { createSelector } from '@ngrx/store';
import { ChansonsState } from '../state/chansons.state';
import { AppState } from '../state/app.state';

export const selectChansonsState = (state: AppState) => state.chansons;

export const selectChansons = createSelector(selectChansonsState, (state: ChansonsState) => state.chansons);
export const selectLoading = createSelector(selectChansonsState, (state: ChansonsState) => state.loading);
export const selectError = createSelector(selectChansonsState, (state: ChansonsState) => state.error);


