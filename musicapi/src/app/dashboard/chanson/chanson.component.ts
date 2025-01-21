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
import {
  getChansonById,
  loadChansonsListe,
} from '../../store/actions/chansons.action';
import { map } from 'rxjs/operators';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { addChanson, updateChanson } from '../../store/actions/chansons.action';
import Swal from 'sweetalert2';
import { Album } from '../../models/album.model';
import {
  selectAlbumListe,
  selectLoading,
  selectError,
} from '../../store/selectors/albumliste.selectors';
import { loadAlbumListe } from '../../store/actions/albumliste.action';
import { selectChansonById } from '../../store/selectors/chansons.selectors';
import { take } from 'rxjs/operators';

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
  albums$ = this.store.select(selectAlbumListe);
  chanson$ = this.store.select(selectChansonById(''));
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  chansonId:string|null=null;
  loading = false;
  error: string | null = null;
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
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  private initForm() {
    this.chansonForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(2)]],
      trackNumber: [null, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      categorie: ['', Validators.required],
      albumId: ['', Validators.required],
      duree: [0],
      dateAjout: [''],
      audioFileId: [''],
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
    // Charger d'abord la liste des albums
    this.store.dispatch(loadAlbumListe());

    // S'assurer que les albums sont chargés avant de traiter les paramètres
    this.albums$.subscribe((albums) => {
      console.log('Albums chargés:', albums); // Pour déboguer
    });
        // Gestion du mode édition
        this.route.params.subscribe((params) => {
          if (params['id']) {
            this.isEditMode = true;
            this.chansonId = params['id'];
            if (this.chansonId) {
              this.store.dispatch(getChansonById({ id: this.chansonId }));
              this.chanson$ = this.store.select(selectChansonById(this.chansonId));
              this.chanson$.subscribe((chanson) => {
                if (chanson) {
                  const albumIdString = chanson.albumId?.toString();
                  console.log('Chanson à éditer:', chanson);
                  this.chansonForm.patchValue({
                    titre: chanson.titre,
                    trackNumber: chanson.trackNumber,
                    description: chanson.description,
                    categorie: chanson.categorie,
                    albumId: albumIdString,
                    audioFileId: chanson.audioFileId,
                  });
                  this.audioDuration = chanson.duree;
                }
              });
            }
          }
        });


  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
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

      console.log('Valeurs du formulaire avant soumission:', formValues);

      // Ajout des champs du formulaire avec coercition explicite
      formData.append('titre', String(formValues.titre));
      formData.append('trackNumber', String(formValues.trackNumber));
      formData.append('description', String(formValues.description));
      formData.append('categorie', String(formValues.categorie));
      formData.append('albumId', String(formValues.albumId));
      formData.append('duree', String(this.audioDuration));

      // Ajout du fichier audio si modifié
      if (this.selectedFile) {
        console.log('Fichier audio sélectionné:', {
          nom: this.selectedFile.name,
          taille: this.selectedFile.size,
          type: this.selectedFile.type,
        });
        formData.append('audioFile', this.selectedFile, this.selectedFile.name);
      }

      // Afficher le contenu du FormData
      console.log('Contenu du FormData:');
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      if (this.isEditMode && this.chansonId) {
        console.log('Mode édition - ID de la chanson:', this.chansonId);
        // Mise à jour d'une chanson existante
        this.store.dispatch(
          updateChanson({ id: this.chansonId, chanson: formData })
        );
        Swal.fire({
          title: 'Chanson mise à jour avec succès',
          icon: 'success',
          timer: 500,
        });
      } else {
        // Création d'une nouvelle chanson
        this.store.dispatch(addChanson({ chanson: formData }));
        Swal.fire({
          title: 'Chanson ajoutée avec succès',
          icon: 'success',
          timer: 500,
        });
      }

      // Redirection après succès
      setTimeout(() => {
        this.router.navigate(['/dashboard/chansons/list']);
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

  // Ajout d'une méthode pour vérifier si le formulaire est valide pour la mise à jour
  get isFormValidForUpdate(): boolean {
    if (this.isEditMode) {
      // En mode édition, le formulaire doit être valide et soit modifié, soit avoir un nouveau fichier
      return (
        this.chansonForm.valid &&
        (this.chansonForm.dirty || this.selectedFile !== null) &&
        !this.isSubmitting
      );
    }
    // En mode création, le formulaire doit être valide et avoir un fichier
    return (
      this.chansonForm.valid && this.selectedFile !== null && !this.isSubmitting
    );
  }
}
