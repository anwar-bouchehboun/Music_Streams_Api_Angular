import { createSelector } from '@ngrx/store';
import { ChansonsState } from '../state/chansons.state';
import { AppState } from '../state/app.state';
import { ChansonResponse } from '../../models/chanson-response.model';
import { PaginatedChansons } from '../actions/chansons.action';

export const selectChansonsState = (state: AppState) => state.chansons;

export const selectChansons = createSelector(
  selectChansonsState,
  (state: ChansonsState) => state.chansons
);
export const selectLoading = createSelector(
  selectChansonsState,
  (state: ChansonsState) => state.loading
);
export const selectError = createSelector(
  selectChansonsState,
  (state: ChansonsState) => state.error
);

export const selectChansonById = (id: string) =>
  createSelector(selectChansons, (chansons: PaginatedChansons | null) => {
    if (chansons?.content) {
      return (
        chansons.content.find(
          (chanson: ChansonResponse) => chanson.id && chanson.id === id
        ) || null
      );
    }
    return null;
  });
