import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChansonService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createChanson(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/chansons`, formData);
  }

  updateChanson(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/chansons/${id}`, formData);
  }

  deleteChanson(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/chansons/${id}`);
  }

  getChansonById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/chansons/${id}`);
  }
}
