import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ChansonResponse } from '../../models/chanson-response.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { selectAlbums } from '../../store/selectors/album.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/state/app.state';
import { getAlbum, loadAlbums } from '../../store/actions/album.action';
import { map } from 'rxjs/operators';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { addChanson } from '../../store/actions/chansons.action';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chanson',
  templateUrl: './chanson.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatPaginatorModule,
  ],
})
export class ChansonComponent implements OnInit {
  albums$ = this.store.select(selectAlbums);
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  selectedFile: File | null = null;
  fileError: string | null = null;
  apiError: string | null = null;
  audioDuration: number = 0;

  chansonForm!: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.initForm();
  }

  private initForm() {
    this.chansonForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(2)]],
      trackNumber: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      categorie: ['', Validators.required],
      albumId: ['', Validators.required],
      duree: [0],
    });
  }

  private getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.addEventListener('loadedmetadata', () => {
        // Convertir la durée en secondes
        const duration = Math.round(audio.duration);
        resolve(duration);
      });
      audio.addEventListener('error', (error) => {
        reject(error);
      });
      audio.src = URL.createObjectURL(file);
    });
  }

  ngOnInit() {
    this.loadAlbums();
    this.albums$.subscribe((albums) => {
      if (albums) {
        this.totalElements = albums.totalElements;
      }
    });
  }

  private loadAlbums() {
    this.store.dispatch(
      loadAlbums({
        page: this.currentPage,
        size: this.pageSize,
      })
    );
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAlbums();
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      if (!file.type.startsWith('audio/')) {
        this.fileError = 'Le fichier doit être un fichier audio';
        this.selectedFile = null;
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        this.fileError = 'Le fichier ne doit pas dépasser 15MB';
        this.selectedFile = null;
        return;
      }

      try {
        // Obtenir la durée du fichier audio
        this.audioDuration = await this.getAudioDuration(file);
        this.chansonForm.patchValue({ duree: this.audioDuration });
        console.log('Durée détectée:', this.audioDuration, 'secondes');

        this.selectedFile = file;
        this.fileError = null;
      } catch (error) {
        console.error('Erreur lors de la lecture de la durée:', error);
        this.fileError = 'Impossible de lire la durée du fichier audio';
        this.selectedFile = null;
      }
    } else {
      this.fileError = 'Le fichier audio est requis';
      this.selectedFile = null;
    }
  }

  onSubmit() {
    if (!this.selectedFile && !this.isEditMode) {
      this.fileError = 'Le fichier audio est requis';
      return;
    }

    if (this.chansonForm.valid && (this.selectedFile || this.isEditMode)) {
      this.isSubmitting = true;
      this.apiError = null;

      const formData = new FormData();
      const formValues = this.chansonForm.value;

      // Ajout des champs du formulaire
      formData.append('titre', formValues.titre);
      formData.append('trackNumber', formValues.trackNumber.toString());
      formData.append('description', formValues.description);
      formData.append('categorie', formValues.categorie);
      formData.append('albumId', formValues.albumId);
      formData.append('duree', this.audioDuration.toString());

      // Ajout du fichier audio
      if (this.selectedFile) {
        formData.append('audioFile', this.selectedFile, this.selectedFile.name);
      }

      // Log pour vérification
      console.log('Form Values:', formValues);
      console.log('Selected File:', this.selectedFile);
      console.log('Durée:', this.audioDuration);

      // Afficher le contenu du FormData
      formData.forEach((value, key) => {
        console.log(key + ':', value);
      });

      // Dispatch de l'action
      this.store.dispatch(addChanson({ chanson: formData }));

      // Redirection après succès
      setTimeout(() => {
        this.router.navigate(['/dashboard/chansons/list']);
        Swal.fire({
          title: 'Chanson ajoutée avec succès',
          icon: 'success',
          timer: 2000,
        });
      }, 1000);
    }
  }

  get titreErrors() {
    const control = this.chansonForm.get('titre');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Le titre est requis';
      if (control.errors['minlength'])
        return 'Le titre doit contenir au moins 2 caractères';
    }
    return null;
  }

  get trackNumberErrors() {
    const control = this.chansonForm.get('trackNumber');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Le numéro de piste est requis';
      if (control.errors['min'])
        return 'Le numéro de piste doit être supérieur à 0';
    }
    return null;
  }

  get descriptionErrors() {
    const control = this.chansonForm.get('description');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'La description est requise';
      if (control.errors['minlength'])
        return 'La description doit contenir au moins 3 caractères';
    }
    return null;
  }

  get categorieErrors() {
    const control = this.chansonForm.get('categorie');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'La catégorie est requise';
    }
    return null;
  }

  get albumIdErrors() {
    const control = this.chansonForm.get('albumId');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return "L'album est requis";
    }
    return null;
  }
}
