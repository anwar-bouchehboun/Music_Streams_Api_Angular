import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ChansonResponse } from '../models/chanson-response.model';

interface PaginatedResponse {
  content: ChansonResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root',
})
export class ChansonsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getChansonsListe(
    page: number = 0,
    size: number = 4,
  ): Observable<PaginatedResponse> {
    return this.http.get<PaginatedResponse>(
      `${this.baseUrl}/admin/chansons/page?page=${page}&size=${size}`
    );
  }
  getChansons(
    page: number = 0,
    size: number = 4,
    albumtitre: string
  ): Observable<PaginatedResponse> {
    let params = new HttpParams()
      .set('nomAlbum', albumtitre)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PaginatedResponse>(
      `${this.baseUrl}/user/chansons/album`,
      { params }
    );
  }
  createChanson(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/chansons`, formData).pipe(
      catchError(this.handleError)
    );
  }
  deleteChanson(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/chansons/${id}`);
  }
  updateChanson(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/chansons/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }
  getChansonById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/chansons/${id}`);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = error.error.message;
    } else {
      // Erreur côté serveur
      if (error.status === 400) {
        errorMessage = error.error.message || 'Données invalides';
      } else if (error.status === 401) {
        errorMessage = 'Non autorisé';
      } else if (error.status === 413) {
        errorMessage = 'Fichier trop volumineux';
      } else if (error.status === 415) {
        errorMessage = 'Format de fichier non supporté';
      }
    }

    return throwError(() => errorMessage);
  }
  getAudioUrl(audioFileId: string): string {
    return `${this.baseUrl}/user/chansons/stream/${audioFileId}`;
  }

  getAllChansons(): Observable<ChansonResponse[]> {
    return this.http.get<ChansonResponse[]>(`${this.baseUrl}admin/chansons`);
  }

}
