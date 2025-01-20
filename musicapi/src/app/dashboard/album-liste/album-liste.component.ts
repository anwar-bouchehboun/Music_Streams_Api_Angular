import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AlbumActions from '../../store/actions/album.action';
import { AppState } from '../../store/state/app.state';
import { tap } from 'rxjs';
import { Album } from '../../models/album.model';
import {
  selectAlbums,
  selectError,
  selectLoading,
} from '../../store/selectors/album.selectors';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { deleteAlbum } from '../../store/actions/album.action';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-album-liste',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, MatPaginatorModule],
  templateUrl: './album-liste.component.html',
})
export class AlbumListeComponent implements OnInit {
  albums$ = this.store.select(selectAlbums);
  loading$ = this.store.select(selectLoading).pipe(
    tap((loading) => {
      if (loading) {
        console.log('🔄 Chargement des albums en cours...');
      } else {
        console.log('✅ Chargement des albums terminé');
      }
    })
  );
  error$ = this.store.select(selectError);
  currentPage = 0;
  pageSize = 4;

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit(): void {
    this.loadAlbums();
  }

  loadAlbums() {
    console.log('📥 Demande de chargement des albums:', {
      page: this.currentPage,
      size: this.pageSize,
    });
    this.store.dispatch(
      AlbumActions.loadAlbums({ page: this.currentPage, size: this.pageSize })
    );
  }

  onEdit(album: Album): void {
    this.router.navigate(['/dashboard/albums/edit', album.id]);
    // TODO: Implémenter la logique d'édition
  }

  onDelete(album: Album): void {

      Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: `Voulez-vous vraiment supprimer l'album "${album.titre}" ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.isConfirmed) {
          if (album.id) {
          this.store.dispatch(deleteAlbum({ id: album.id }));
          this.router.navigate(['/dashboard/albums/list']);
          Swal.fire({
            title: 'Album supprimé avec succès',
            icon: 'success',
            timer: 2000,
          });
        }
      }
      });

    // TODO: Implémenter la logique de suppression
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAlbums();
  }
}
