import { addAlbum, updateAlbum } from './../store/actions/album.action';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Album } from '../models/album.model';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface PaginatedResponse {
  content: Album[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAlbum(): Observable<Album[]> {
    console.log('getAlbum sans pagination ');
    return this.http
      .get<Album[]>(`${this.baseUrl}/admin/albums`)
      .pipe(tap((response) => console.log('Albums received:', response)));
  }

  getAlbums(
    page: number = 0,
    size: number = 4,
    search?: string
  ): Observable<PaginatedResponse> {
    console.log('Fetching albums with params:', { page, size, search });

    // Construire l'URL avec les paramètres
    let url: string;
    if (search) {
      url = `${this.baseUrl}/user/albums/recherche/titre?titre=${search}&page=${page}&size=${size}`;

      return this.http.get<PaginatedResponse>(url);
    } else {
      url = `${this.baseUrl}/user/albums/page`;
      const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());
      return this.http.get<PaginatedResponse>(url, { params });
    }
  }

  addAlbum(album: Album): Observable<Album> {
    return this.http.post<Album>(`${this.baseUrl}/admin/albums`, album);
  }
  updateAlbum(album: Album): Observable<Album> {
    return this.http.put<Album>(
      `${this.baseUrl}/admin/albums/${album.id}`,
      album
    );
  }
  getAlbumById(id: string): Observable<Album> {
    return this.http.get<Album>(`${this.baseUrl}/admin/albums/${id}`);
  }
  deleteAlbum(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/albums/${id}`);
  }
  getAllAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.baseUrl}/admin/albums`);
  }
}
