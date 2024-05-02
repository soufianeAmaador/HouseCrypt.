import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/Project';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit{
    @ViewChild('pledgeModal') pledgeModal: any;
    autoChange: boolean = false;
    pledgeAmount!: number;
    imagesAndVideos: string[] = [];
    project: Project | undefined = undefined;
    projectId!: string | null;

    constructor(private projectService: ProjectService,
      private errorHandlerService: ErrorHandlerService,
      private route: ActivatedRoute,
      private router: Router
      ){}

    ngOnInit(): void {
      this.projectId = this.route.snapshot.queryParamMap.get('id');
      console.log(this.projectId);
      if(this.projectId == null || this.projectId === ""){
        this.router.navigate(['/']);
        this.errorHandlerService.handleError("Project not found!");
      }
      this.getAllProjects();
    }

  getAllProjects() {

    this.projectService.getAllProjects().subscribe({
      next: (projects: Project[]) =>{
        this.project = projects.find(project => project.projectId === this.projectId);
        console.log("this");
        console.log(this.project);
        this.loadMedia();
      },
      error: (error) =>{
        console.log(error);
        this.errorHandlerService.handleError(error);
      },
    })
  }

  loadMedia(){
    this.imagesAndVideos = 
    [
      ...(this.imagesAndVideos || []),
      ...(this.project?.projectPhotos.map(photo =>  photo.path) || []),
      ...(this.project?.projectVideos.map(video =>  video.path) || [])
  ];

  console.log(this.imagesAndVideos);
  }

  submitPledge(pledgeAmount: number): void {
    this.pledgeAmount = pledgeAmount;
    this.pledgeModal.hide();
  }

}
