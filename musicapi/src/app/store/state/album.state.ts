import { Album } from '../../models/album.model';

export interface AlbumState {
  albums: {
    content: Album[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AlbumState = {
  albums: null,
  loading: false,
  error: null,
};



