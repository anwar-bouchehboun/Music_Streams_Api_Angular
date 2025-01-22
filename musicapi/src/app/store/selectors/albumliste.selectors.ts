import { createSelector } from '@ngrx/store';
import { Album } from '../../models/album.model';
import { AppState } from '../state/app.state';

// Définir l'interface de l'état
export interface AlbumState {
  albums: Album[];
  loading: boolean;
  error: string | null;
}

// Créer le sélecteur de feature
//export const selectAlbumFeature = createFeatureSelector<AlbumListeState>('albumListe');
export const selectAlbumState = (state: AppState) => state.albumListe;


// Créer le sélecteur pour la liste des albums
export const selectAlbumListe = createSelector(
  selectAlbumState,
  (state) => state?.albums || []
);
export const selectLoading = createSelector(
  selectAlbumState,
  (state) => state?.loading || false
);
export const selectError = createSelector(
  selectAlbumState,
  (state) => state?.error || null
);


