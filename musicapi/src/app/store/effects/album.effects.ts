import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AlbumService } from '../../services/album.service';
import {
  loadAlbums,
  loadAlbumsSuccess,
  loadAlbumsFailure,
} from '../actions/album.action';

@Injectable()
export class AlbumEffects {
  constructor(private actions$: Actions, private albumService: AlbumService) {}

  loadAlbums$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAlbums),
      mergeMap(({ page, size }) =>
        this.albumService.getAlbums(page, size).pipe(
          map((albums) => loadAlbumsSuccess({ albums })),
          catchError((error) => {
            console.error('Erreur lors du chargement des albums:', error);
            return of(
              loadAlbumsFailure({
                error: 'Impossible de charger les albums. Veuillez réessayer.',
              })
            );
          })
        )
      )
    )
  );
}
