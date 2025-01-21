import { ChansonResponse } from '../../models/chanson-response.model';

export interface ChansonsListeState {
  chansons: ChansonResponse[];
  loading: boolean;
  error: string | null;
}

export const initialState: ChansonsListeState = {
  chansons: [],
  loading: false,
  error: null,
};
