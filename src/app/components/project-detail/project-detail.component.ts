import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/Project';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit{
  @ViewChild('pledgeModal') pledgeModal: any;

  pledgeAmount!: number;
    // Array of image and video paths
    imagesAndVideos: string[] = [
    ];

    project: Project | undefined = undefined;

    constructor(private projectService: ProjectService,
      private errorHandlerService: ErrorHandlerService,
      private authService: AuthService
      ){}

    ngOnInit(): void {
      this.getAllProjects();
    }

  getAllProjects() {

    this.projectService.getAllProjects().subscribe({
      next: (projects: Project[]) =>{
        this.project = projects[0];
        this.loadMedia();
      },
      error: (error) =>{
        console.log(error);
        this.errorHandlerService.handleError(error);
      },
    })
  }

  loadMedia(){
    const BASE_URL = this.authService.getBaseUrl();
    this.imagesAndVideos = 
    [
      ...(this.imagesAndVideos || []),
      ...(this.project?.projectPhotos.map(photo => BASE_URL + photo.path) || []),
      ...(this.project?.projectVideos.map(video => BASE_URL + video.path) || [])
  ];
  }

  submitPledge(pledgeAmount: number): void {
    this.pledgeAmount = pledgeAmount;
    this.pledgeModal.hide();
  }

}
