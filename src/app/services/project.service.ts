import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/Project';
import { ErrorHandlerService } from './error-handler.service';
import { Donation } from '../models/Donation';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly baseUrl = "http://localhost:5050";
  private readonly getAllProjectsUrl = `${this.baseUrl}/all-projects`;
  private readonly getProjectUrl = `${this.baseUrl}/project`;
  private readonly getProjectDonationsUrl = `${this.baseUrl}/get-project-donations`;
  private readonly uploadProjectUrl = `${this.baseUrl}/upload-project`;
  private readonly getDonationUrl = `${this.baseUrl}/get-donations`;

  constructor(private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) { }

  uploadProject(project: FormData): Observable<any> {
    return this.http.post<FormData>(this.uploadProjectUrl, project,{
      withCredentials: true,
    });
  }

  // Temporary function, obviously if we get tons of projects this wouldn't fly
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.getAllProjectsUrl);
  }

  loadProject(id: string): Observable<Project>{
    return this.http.get<Project>(`${this.getProjectUrl}/${id}`);
  }

  loadProjectDonations(id: string): Observable<Donation[]>{
    return this.http.get<Donation[]>(`${this.getProjectDonationsUrl}/${id}`);
  }

  getDonations(id: string): Observable<JSON>{
    console.log("getDonations called ")
    return this.http.get<JSON>(`${this.getDonationUrl}/${id}`);
  }
  
}
