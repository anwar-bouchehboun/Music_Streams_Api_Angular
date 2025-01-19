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
} from '../actions/chansons.action';

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
}
