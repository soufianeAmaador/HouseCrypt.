import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { Project } from '../models/Project';
import { ErrorHandlerService } from './error-handler.service';
import { Donation } from '../models/Donation';
import { Update } from '../models/update';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly baseUrl = "http://localhost:5050";
  private readonly getAllProjectsUrl = `${this.baseUrl}/all-projects`;
  private readonly getProjectUrl = `${this.baseUrl}/project`;
  private readonly getProjectDonationsUrl = `${this.baseUrl}/get-project-donations`;
  private readonly uploadProjectUrl = `${this.baseUrl}/upload-project`;
  private readonly updateProjectUrl = `${this.baseUrl}/update-project`;
  private readonly getDonationUrl = `${this.baseUrl}/get-donations`;
  private readonly uploadUpdateUrl = `${this.baseUrl}/upload-update`;
  private readonly getProjectSCIDURL = `${this.baseUrl}/get-projectscid`;

  constructor(private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) { }

  uploadProject(project: FormData): Observable<any> {
    return this.http.post<FormData>(this.uploadProjectUrl, project,{
      withCredentials: true,
    });
  }

  uploadUpdate(update: FormData): Observable<any> {
    return this.http.post<FormData>(this.uploadUpdateUrl, update,{
      withCredentials: true,
    });
  }

  updateProject(project: FormData) {
    console.log(project);
    this.http
    .post<FormData>(this.updateProjectUrl, project, {
      withCredentials: true,
    }).subscribe({
      next: (res) => { 
        console.log("Project upload successful!")
      },
      error: (error) => {
        this.errorHandlerService.handleError(error);
      }
    });
  }

  // Temporary function, obviously if we get tons of projects this wouldn't fly
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.getAllProjectsUrl);
  }

  loadProject(id: string): Observable<Project>{
    return this.http.get<Project>(`${this.getProjectUrl}/${id}`);
  }

  getProjectSCID(id: string): Promise<number> {
    return lastValueFrom(this.http.get<number>(`${this.getProjectSCIDURL}/${id}`));
  }

  loadProjectDonations(id: string): Observable<Donation[]>{
    return this.http.get<Donation[]>(`${this.getProjectDonationsUrl}/${id}`);
  }

  getDonations(id: string): Observable<JSON>{
    console.log("getDonations called ")
    return this.http.get<JSON>(`${this.getDonationUrl}/${id}`);
  }

  getBaseUrl(): string{
    return this.baseUrl;
  }
  
}
