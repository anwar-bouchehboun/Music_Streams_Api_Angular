import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Album } from '../../models/album.model';
import { AlbumListeState } from '../state/albumliste.state';
import { AppState } from '../state/app.state';

// Définir l'interface de l'état
export interface AlbumState {
  albums: Album[];
  loading: boolean;
  error: string | null;
}

// Créer le sélecteur de feature
export const selectAlbumFeature = createFeatureSelector<AlbumListeState>('albumListe');

// Créer le sélecteur pour la liste des albums
export const selectAlbumListe = createSelector(
  selectAlbumFeature,
  (state) => state?.albums || []
);
export const selectLoading = createSelector(
  selectAlbumFeature,
  (state) => state?.loading || false
);
export const selectError = createSelector(
  selectAlbumFeature,
  (state) => state?.error || null
);


