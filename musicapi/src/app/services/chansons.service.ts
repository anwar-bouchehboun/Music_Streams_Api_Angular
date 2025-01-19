import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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
}
