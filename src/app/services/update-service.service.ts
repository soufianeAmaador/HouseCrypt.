import { Injectable } from '@angular/core';
import { Update } from '../models/update';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateServiceService {

  private updates: Update[] | undefined;
  private readonly baseUrl = "http://localhost:5050";
  private readonly getProjectUpdatesUrl = `${this.baseUrl}/get-project-updates`;
  private readonly getUserUpdatesUrl = `${this.baseUrl}/get-user-updates`;
  private readonly saveUpdateUrl = `${this.baseUrl}/upload-update`;

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
  ) {}

  getAllUpdatesOfProject(id: string): Observable<Update[]> {
    return this.http.get<Update[]>(`${this.getProjectUpdatesUrl}/${id}`);
  }

  getAllUpdatesOfUser(id: string): Observable<Update[]> {
    return this.http.get<Update[]>(`${this.getUserUpdatesUrl}/${id}`);
  }

  saveUpdate(update: Update): Observable<any> {
    return this.http.post<Update>(`${this.saveUpdateUrl}`, update,{
      withCredentials: true,
    });
  }
}
