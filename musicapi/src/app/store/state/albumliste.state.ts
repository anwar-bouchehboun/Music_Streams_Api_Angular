import { Album } from "../../models/album.model";

export interface AlbumListeState {
  albums: Album[];
  loading: boolean;
  error: string | null;
}

export const initialAlbumListeState: AlbumListeState = {
  albums: [],
  loading: false,
  error: null,
};

