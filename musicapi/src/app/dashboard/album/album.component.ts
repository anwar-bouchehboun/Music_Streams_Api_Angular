import { Album } from './../../models/album.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  addAlbum,
  getAlbumById,
  updateAlbum,
} from '../../store/actions/album.action';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AppState } from '../../store/state/app.state';
import {
  selectAlbums,
  selectAlbumById,
} from '../../store/selectors/album.selectors';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './album.component.html',
})
export class AlbumComponent implements OnInit {
  albumForm!: FormGroup;
  isEditMode = false;
  albumId: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
  }

  private initForm() {
    this.albumForm = this.fb.group({
      titre: ['', [Validators.required]],
      artiste: ['', [Validators.required]],
      annee: [
        '',
        [
          Validators.required,
          Validators.min(1900),
          Validators.max(new Date().getFullYear()),
        ],
      ],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.albumId = params['id'];
        if (this.albumId) {
          this.store.dispatch(getAlbumById({ id: this.albumId }));

          this.store
            .select(selectAlbumById(this.albumId))
            .pipe(
              filter(
                (album): album is Album => album !== null && album !== undefined
              )
            )
            .subscribe((album) => {
              this.albumForm.patchValue({
                titre: album.titre,
                artiste: album.artiste,
                annee: album.annee,
              });
            });
        }
      }
    });
  }

  onSubmit() {
    if (this.albumForm.valid) {
      const albumData: Album = this.albumForm.value;

      if (this.isEditMode && this.albumId) {
        this.store.dispatch(
          updateAlbum({
            album: { ...albumData, id: this.albumId },
          })
        );

        this.router.navigate(['/dashboard/albums/list']);
        Swal.fire({
          title: 'Album modifié avec succès',
          icon: 'success',
          timer: 2000,
        });
      } else {
        this.store.dispatch(addAlbum({ album: albumData }));

        this.router.navigate(['/dashboard/albums/list']);
        Swal.fire({
          title: 'Album Create avec succès',
          icon: 'success',
          timer: 2000,
        });
      }
    }
  }
}
