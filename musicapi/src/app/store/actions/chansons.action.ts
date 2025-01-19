import { createAction, props } from '@ngrx/store';
import { ChansonResponse } from '../../models/chanson-response.model';

export interface PaginatedChansons {
  content: ChansonResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const loadChansons = createAction(
  '[Chansons] Load Chansons',
  props<{ page: number; size: number; albumtitre?: string }>()
);

export const loadChansonsSuccess = createAction(
  '[Chansons] Load Chansons Success',
  props<{ chansons: PaginatedChansons }>()
);

export const loadChansonsFailure = createAction(
  '[Chansons] Load Chansons Failure',
  props<{ error: any }>()
);

export const addChanson = createAction(
  '[Chansons] Add Chanson',
  props<{ chanson: FormData }>()
);

export const addChansonSuccess = createAction(
  '[Chansons] Add Chanson Success',
  props<{ chanson: ChansonResponse }>()
);

export const addChansonFailure = createAction(
  '[Chansons] Add Chanson Failure',
  props<{ error: any }>()
);

export const deleteChanson = createAction(
  '[Chansons] Delete Chanson',
  props<{ id: string }>()
);

export const deleteChansonSuccess = createAction(
  '[Chansons] Delete Chanson Success',
  props<{ id: string }>()
);

export const deleteChansonFailure = createAction(
  '[Chansons] Delete Chanson Failure',
  props<{ error: any }>()
);

export const updateChanson = createAction(
  '[Chansons] Update Chanson',
  props<{ chanson: ChansonResponse }>()
);

export const updateChansonSuccess = createAction(
  '[Chansons] Update Chanson Success',
  props<{ chanson: ChansonResponse }>()
);

export const updateChansonFailure = createAction(
  '[Chansons] Update Chanson Failure',
  props<{ error: any }>()
);

export const unloadChansons = createAction('[Chansons] Unload Chansons');
