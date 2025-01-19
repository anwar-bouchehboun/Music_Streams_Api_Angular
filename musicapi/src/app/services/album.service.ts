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

  getAlbums(page: number = 0, size: number = 4): Observable<PaginatedResponse> {
    console.log('Fetching albums with params:', { page, size });
    return this.http
      .get<PaginatedResponse>(
        `${this.baseUrl}/user/albums/page?page=${page}&size=${size}`
      )
      .pipe(tap((response) => console.log('Albums received:', response)));
  }


}
