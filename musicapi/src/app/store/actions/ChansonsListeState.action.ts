import { createAction, props } from '@ngrx/store';
import { ChansonResponse } from '../../models/chanson-response.model';

export const getChansonsListe = createAction('[ChansonsListe] Get Chansons Liste');
export const getChansonsListeSuccess = createAction('[ChansonsListe] Get Chansons Liste Success', props<{ chansons: ChansonResponse[] }>());
export const getChansonsListeFailure = createAction('[ChansonsListe] Get Chansons Liste Failure', props<{ error: string }>());
