import { ChansonResponse } from '../../models/chanson-response.model';

export interface ChansonsState {
  chansons: {
    content: ChansonResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export const initialState: ChansonsState = {
  chansons: null,
  loading: false,
  error: null,
};

