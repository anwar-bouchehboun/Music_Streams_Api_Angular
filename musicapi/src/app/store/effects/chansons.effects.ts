import { loadChansonsListe, loadChansonsListeSuccess, loadChansonsListeFailure, deleteChansonSuccess, deleteChansonFailure, getChansonByIdFailure, getChansonByIdSuccess, getChansonById, updateChanson, updateChansonFailure, updateChansonSuccess } from './../actions/chansons.action';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ChansonsService } from '../../services/chansons.service';
import {
  loadChansons,
  loadChansonsSuccess,
  loadChansonsFailure,
  PaginatedChansons,
  addChanson,
  addChansonSuccess,
  addChansonFailure,
  deleteChanson
} from '../actions/chansons.action';
import { ChansonResponse } from '../../models/chanson-response.model';

@Injectable()
export class ChansonsEffects {
  constructor(
    private actions$: Actions,
    private chansonsService: ChansonsService
  ) {}

  loadChansons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadChansons),
      tap((action) => console.log('Action loadChansons:', action)),
      mergeMap(({ page, size, albumtitre }) =>
        this.chansonsService.getChansons(page, size, albumtitre!).pipe(
          tap((response) => console.log('API Response:', response)),
          map((response: PaginatedChansons) => {
            console.log('Mapped Success Response:', response);
            return loadChansonsSuccess({ chansons: response });
          }),
          catchError((error) => {
            console.error('Error Response:', error);
            return of(
              loadChansonsFailure({
                error:
                  'Impossible de charger les chansons. Veuillez réessayer.',
              })
            );
          })
        )
      )
    )
  );

  addChanson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addChanson),
      tap((action) => console.log('Action addChanson:', action)),
      mergeMap(({ chanson }) =>
        this.chansonsService.createChanson(chanson).pipe(
          map((response) => addChansonSuccess({ chanson: response })),
          tap((response) => console.log('API Response:', response)),
          catchError((error) => of(addChansonFailure({ error })))
        )
      )
    )
  );
  loadChansonsListe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadChansonsListe),
      tap((action) => console.log('Action loadChansonsListe:', action)),
      mergeMap(({ page, size }) =>
        this.chansonsService.getChansonsListe(page, size).pipe(
          map((response) => loadChansonsListeSuccess({ chansons: response })),
          catchError((error) => of(loadChansonsListeFailure({ error })))
        )
      )
    )
  );
  deleteChansos$=createEffect(()=>
    this.actions$.pipe(
      ofType(deleteChanson),
      mergeMap(({id})=>this.chansonsService.deleteChanson(id).pipe(
        tap(response=>console.log('API Response:',response)),
        map(()=>deleteChansonSuccess({id})),
        catchError((error)=>of(deleteChansonFailure({error}))
      )
    )
  ))
  );
  getChansonById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getChansonById),
      mergeMap(({ id }) => this.chansonsService.getChansonById(id).pipe(
        tap(id => console.log(" getChansonById id", id)),
        map((chanson) => getChansonByIdSuccess({ chanson })),
        tap(chanson => console.log(" getChansonById chanson", chanson)),
        catchError((error) => of(getChansonByIdFailure({ error })))
      ))
    )
  );
  updateChanson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateChanson),
      mergeMap(({ id, chanson }) => this.chansonsService.updateChanson(id, chanson as FormData).pipe(
        map(() => updateChansonSuccess({ chanson: chanson as ChansonResponse })),
        catchError((error) => of(updateChansonFailure({ error })))
      ))
    )
  );
}
