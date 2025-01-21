
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AlbumService } from '../../services/album.service';
import { loadAlbumListe, loadAlbumListeSuccess, loadAlbumListeFailure } from '../actions/albumliste.action';


@Injectable()
export class AlbumListeEffects {

    constructor(private actions$: Actions, private albumService: AlbumService) {}


    getAlbum$ = createEffect(() =>
      this.actions$.pipe(
        ofType(loadAlbumListe),
        mergeMap(() => this.albumService.getAllAlbums().pipe(
          tap(albums => console.log(" getAlbum avant albums", albums)),
          map((albums) => loadAlbumListeSuccess({ albums })),
          tap(albums => console.log(" getAlbum après albums", albums)),
          catchError((error) => of(loadAlbumListeFailure({ error })))
        ))
      )
    );

}
