import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Album } from '../models/album.model';
import { AuthService } from './auth.service';
import { HttpHeaders } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';

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
  private baseUrl = 'http://localhost:8086/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAlbums(page: number = 0, size: number = 4): Observable<PaginatedResponse> {
    console.log('Fetching albums with params:', { page, size });
    return this.http
      .get<PaginatedResponse>(
        `${this.baseUrl}/user/albums/page?page=${page}&size=${size}`
      )
      .pipe(tap((response) => console.log('Albums received:', response)));
  }
}
