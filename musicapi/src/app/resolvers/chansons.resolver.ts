import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, delay, filter, first, tap } from 'rxjs/operators';
import { AppState } from '../store/state/app.state';
import { loadChansons } from '../store/actions/chansons.action';
import { selectLoading } from '../store/selectors/chansons.selectors';

@Injectable({
  providedIn: 'root',
})
export class ChansonsResolver implements Resolve<boolean> {
  constructor(private store: Store<AppState>) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    console.log('🚀 ChansonsResolver: Démarrage...');
    const albumtitre = route.paramMap.get('titre');

    if (!albumtitre) {
      console.log("❌ ChansonsResolver: Pas de titre d'album trouvé");
      return of(false);
    }

    console.log(
      "📝 ChansonsResolver: Chargement des chansons pour l'album:",
      albumtitre
    );

    return new Observable((observer) => {
      this.store.dispatch(
        loadChansons({
          page: 0,
          size: 4,
          albumtitre,
          searchTerm: '',
        })
      );

      console.log('⏳ ChansonsResolver: En attente du chargement...');

      this.store
        .select(selectLoading)
        .pipe(
          filter((loading) => !loading),
          delay(1000),
          first(),
          tap(() => {
            console.log('✅ ChansonsResolver: Chargement terminé avec succès');
            observer.next(true);
            observer.complete();
          }),
          catchError((error) => {
            console.error(
              '❌ ChansonsResolver: Erreur lors du chargement:',
              error
            );
            observer.next(false);
            observer.complete();
            return of(false);
          })
        )
        .subscribe();
    });
  }
}
