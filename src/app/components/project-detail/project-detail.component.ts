import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/Project';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

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
    daysToGo: number = 0;

    constructor(private projectService: ProjectService,
      private userService: UserService,
      private errorHandlerService: ErrorHandlerService,
      private route: ActivatedRoute,
      private router: Router
      ){}

    ngOnInit(): void {
      this.projectId = this.route.snapshot.queryParamMap.get('id');
      if(this.projectId == null || this.projectId === ""){
        this.router.navigate(['/']);
        this.errorHandlerService.handleError("Project not found!");
      }
      this.loadProject(); 
    }

  loadProject(){
    this.projectService.loadProject(this.projectId!).subscribe({
      next: (project) => {
        this.project = project;
        this.daysToGo = Math.ceil((new Date(this.project!.projectDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        this.loadMedia();
      },
      error: (error) => {
        console.log(error);
        this.errorHandlerService.handleError(error);
      }
    });
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
    const user = this.userService.getUser();

    if(user === undefined || this.project === undefined){
      this.errorHandlerService.handleError("something went wrong! Try again later");
      return;
    }
    
    this.userService.addDonation({
      user: user,
      project: this.project.projectId,
      amount: this.pledgeAmount,
      time: new Date()
    });
  }

}
