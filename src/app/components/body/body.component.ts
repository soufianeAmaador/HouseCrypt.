import { Component, OnInit } from '@angular/core';
import { Property } from 'src/app/models/property';
import { PropertyService } from 'src/app/services/property-service.service';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/Project';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {

  properties!: Property[];
  projects: Project[] | undefined;
  constructor(private propertyService: PropertyService,
    private projectService: ProjectService,
    private errorHandlerService: ErrorHandlerService,
    private authService: AuthService) { }

  ngOnInit(): void {
    // this.properties = Array.from(this.propertyService.getAllProperties().values()); 
    this.getAllProjects();
  }

  getAllProjects() {

    this.projectService.getAllProjects().subscribe({
      next: (projects: Project[]) =>{
        const BASE_URL = this.authService.getBaseUrl();
        projects.map(project => {
          project.projectPhotos.map(photo => {
            photo.path = BASE_URL + photo.path;
          });
          project.projectVideos.map(video => {
            video.path = BASE_URL + video.path;
          });

        });
        this.projects = projects;
      },
      error: (error) =>{
        console.log(error);
        this.errorHandlerService.handleError(error);
      },
    })
  }

}
