import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/Project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly baseUrl = "http://localhost:5050";
  private readonly getAllProjectsUrl = `${this.baseUrl}/all-projects`;
  private readonly uploadProjectUrl = `${this.baseUrl}/upload-project`;
  constructor(private http: HttpClient) { }

  uploadProject(formData: FormData): Observable<any> {
    return this.http.post<any>(this.uploadProjectUrl, formData,{
      withCredentials: true,
    });
  }

  // Temporary function, obviously if we get tons of projects this wouldn't fly
  getAllProjects(): Observable<Project[]> {
    console.log("called");
    return this.http.get<Project[]>(this.getAllProjectsUrl);
  }
}
