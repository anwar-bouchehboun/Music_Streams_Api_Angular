import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AlbumActions from '../../store/actions/album.action';
import { AppState } from '../../store/state/app.state';
import { tap, distinctUntilChanged, debounceTime, map } from 'rxjs/operators';
import { Album } from '../../models/album.model';
import {
  selectAlbums,
  selectError,
  selectLoading,
} from '../../store/selectors/album.selectors';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { deleteAlbum } from '../../store/actions/album.action';
import Swal from 'sweetalert2';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  combineLatest,
} from 'rxjs';

@Component({
  selector: 'app-album-liste',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    MatPaginatorModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './album-liste.component.html',
})
export class AlbumListeComponent implements OnInit, OnDestroy {
  private rawAlbums$ = this.store.select(selectAlbums);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  currentPage = 0;
  pageSize = 4;
  searchTerm: string = '';
  private searchTerms = new BehaviorSubject<string>('');
  private subscriptions: Subscription[] = [];

  // Filtrage instantané des albums
  albums$ = combineLatest([
    this.rawAlbums$,
    this.searchTerms.pipe(map((term) => term.toLowerCase().trim())),
  ]).pipe(
    map(([albums, searchTerm]) => {
      if (!albums || !searchTerm) return albums;

      const filteredContent = albums.content.filter(
        (album) =>
          album.titre.toLowerCase().includes(searchTerm) ||
          album.artiste.toLowerCase().includes(searchTerm) ||
          album.annee.toString().includes(searchTerm)
      );

      return {
        ...albums,
        content: filteredContent,
        totalElements: filteredContent.length,
        totalPages: Math.ceil(filteredContent.length / this.pageSize),
      };
    })
  );

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // S'abonner aux changements de paramètres d'URL
    this.subscriptions.push(
      this.route.queryParams.subscribe((params) => {
        const query = params['q'] || '';
        if (query !== this.searchTerm) {
          this.searchTerm = query;
          this.searchTerms.next(query);
          this.loadAlbums();
        }
      })
    );
  }

  ngOnInit(): void {
    this.loadAlbums();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private updateUrlAndSearch(term: string) {
    // Mettre à jour l'URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: term || null },
      queryParamsHandling: 'merge',
    });
  }

  loadAlbums() {
    this.store.dispatch(
      AlbumActions.loadAlbums({
        page: this.currentPage,
        size: this.pageSize,
        search: '', 
      })
    );
  }

  onSearch(): void {
    const term = this.searchTerm.trim();
    this.searchTerms.next(term);
    this.updateUrlAndSearch(term);
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const term = input.value.trim();
    this.searchTerms.next(term);
    this.updateUrlAndSearch(term);
  }

  onSearchClear(): void {
    this.searchTerm = '';
    this.searchTerms.next('');
    this.updateUrlAndSearch('');
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
