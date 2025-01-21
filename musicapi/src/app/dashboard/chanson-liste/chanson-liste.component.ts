import { Component, OnInit } from '@angular/core';
import { AppState } from '../../store/state/app.state';
import { Store } from '@ngrx/store';
import { selectChansons } from '../../store/selectors/chansons.selectors';
import {
  selectError,
  selectLoading,
} from '../../store/selectors/chansons.selectors';
import { ChansonResponse } from '../../models/chanson-response.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { deleteChanson, loadChansonsListe } from '../../store/actions/chansons.action';
import { DurationPipe } from '../../pipes/duration.pipe';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, MatPaginatorModule, DurationPipe],
  selector: 'app-chanson-liste',
  templateUrl: './chanson-liste.component.html',
})
export class ChansonListeComponent implements OnInit {
  chansons: ChansonResponse[] = [];
  chansons$ = this.store.select(selectChansons);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  pageSize = 5;
  currentPage = 0;

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit() {
    this.getChansons();
  }

  getChansons() {
    this.store.dispatch(loadChansonsListe({ page: this.currentPage, size: this.pageSize }));
  }

  onEdit(chanson: ChansonResponse) {
    if(chanson.id){
      this.router.navigate(['dashboard/chansons/edit', chanson.id]);
    }
    // Navigation vers la page d'édition
    // À implémenter selon vos besoins
  }

  onDelete(chanson: ChansonResponse) {

    if(chanson.id){
      Swal.fire({
        title: 'Voulez-vous vraiment supprimer cette chanson ?',
        text: `Voulez-vous vraiment supprimer la chanson "${chanson.titre}" ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.isConfirmed) {
          this.store.dispatch(deleteChanson({id:chanson.id}))
          this.router.navigate(['dashboard/chansons/list'])
          Swal.fire({
            title: 'Chanson supprimée avec succès',
            icon: 'success',
            timer: 2000,
          });
        }
      })


    }
    // Logique de suppression
    // À implémenter selon vos besoins
  }

  onPageChange(event: any) {
    // Dispatch une action pour charger la nouvelle page
    this.store.dispatch(
      loadChansonsListe({
        page: event.pageIndex,
        size: event.pageSize,
      })
    );
  }
}
