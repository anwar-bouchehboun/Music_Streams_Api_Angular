import { addAlbum, updateAlbum } from './../store/actions/album.action';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getAlbum() {
    console.log('getAlbum sans pagination ' );
    return this.http.get<Album>(`${this.baseUrl}/admin/albums`)
    .pipe(tap((response) => console.log('Albums received:', response)));

  }

  getAlbums(page: number = 0, size: number = 4): Observable<PaginatedResponse> {
    console.log('Fetching albums with params:', { page, size });
    return this.http
      .get<PaginatedResponse>(
        `${this.baseUrl}/user/albums/page?page=${page}&size=${size}`
      )
      .pipe(tap((response) => console.log('Albums received:', response)));
  }

  addAlbum(album: Album): Observable<Album> {
    return this.http.post<Album>(`${this.baseUrl}/admin/albums`, album);
  }
  updateAlbum(album: Album): Observable<Album> {
    return this.http.put<Album>(`${this.baseUrl}/admin/albums/${album.id}`, album);
  }
  getAlbumById(id: string): Observable<Album> {
    return this.http.get<Album>(`${this.baseUrl}/admin/albums/${id}`);
  }
  deleteAlbum(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/albums/${id}`);
  }
}
