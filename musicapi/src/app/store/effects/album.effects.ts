import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AlbumService } from '../../services/album.service';
import {
  loadAlbums,
  loadAlbumsSuccess,
  loadAlbumsFailure,
  addAlbum,
  addAlbumSuccess,
  addAlbumFailure,
  updateAlbumSuccess,
  updateAlbumFailure,
  updateAlbum,
  deleteAlbumFailure,
  deleteAlbumSuccess,
  deleteAlbum,
  getAlbumByIdSuccess,
  getAlbumByIdFailure,
  getAlbumById,
  getAlbumFailure,
  getAlbumSuccess,
  getAlbum,
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
  addAlbum$ = createEffect(() =>
        this.actions$.pipe(
          ofType(addAlbum),
          mergeMap(({ album }) => this.albumService.addAlbum(album).pipe(
            tap(album => console.log(album)),
            map((album) => addAlbumSuccess({ album })),
            catchError((error) => of(addAlbumFailure({ error })))
          ))
        )
  );
  updateAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateAlbum),
      mergeMap(({ album }) => this.albumService.updateAlbum(album).pipe(
        tap(album => console.log(album)),
        map((album) => updateAlbumSuccess({ album })),
        tap(album => console.log(" updateAlbum album", album)),
        catchError((error) => of(updateAlbumFailure({ error })))
      ))
    )
  );
  deleteAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteAlbum),
      mergeMap(({ id }) => this.albumService.deleteAlbum(id).pipe(
        tap(id => console.log(" delete id", id)),
        map(() => deleteAlbumSuccess({ id })),
        catchError((error) => of(deleteAlbumFailure({ error })))
      ))
    )
  );
  getAlbumById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAlbumById),
      mergeMap(({ id }) => this.albumService.getAlbumById(id).pipe(
        tap(id => console.log(" getAlbumById id", id)),
        map((album) => getAlbumByIdSuccess({ album })),
        tap(album => console.log(" getAlbumById album", album)),
        catchError((error) => of(getAlbumByIdFailure({ error })))
      ))
    )
  );

}
