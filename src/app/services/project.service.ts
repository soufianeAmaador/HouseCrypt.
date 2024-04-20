import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly baseUrl = "http://localhost:5050";
  private readonly uploadProjectUrl = `${this.baseUrl}/upload-project`;
  constructor(private http: HttpClient) { }

  uploadProject(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.uploadProjectUrl}`, formData,{
      withCredentials: true,
    });
  }
}
