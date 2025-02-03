import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, delay, filter, first, tap } from 'rxjs/operators';
import { AppState } from '../store/state/app.state';
import { loadAlbumListe } from '../store/actions/albumliste.action';
import {
  selectAlbumListe,
  selectLoading,
} from '../store/selectors/albumliste.selectors';

@Injectable({
  providedIn: 'root',
})
export class AlbumResolver implements Resolve<boolean> {
  constructor(private store: Store<AppState>) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    return new Observable((observer) => {
      this.store.dispatch(loadAlbumListe());

      this.store
        .select(selectLoading)
        .pipe(
          filter((loading) => !loading),
          delay(1000),
          first(),
          tap(() => {
            observer.next(true);
            observer.complete();
          }),
          catchError((error) => {
            console.error('Erreur lors du chargement des albums:', error);
            observer.next(false);
            observer.complete();
            return of(false);
          })
        )
        .subscribe();
    });
  }
}
