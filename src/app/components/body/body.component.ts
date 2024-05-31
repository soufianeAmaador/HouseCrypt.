import { Component, OnInit } from '@angular/core';
import { Property } from 'src/app/models/property';
import { PropertyService } from 'src/app/services/property-service.service';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/Project';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {

  properties!: Property[];
  projects: Project[] | undefined;
  autoChange: boolean = true;
  // Array of image and video paths

  constructor(private propertyService: PropertyService,
    private projectService: ProjectService,
    private errorHandlerService: ErrorHandlerService,
    private userService: UserService
) { }

  ngOnInit(): void {
    // this.properties = Array.from(this.propertyService.getAllProperties().values()); 
    this.getAllProjects();
    console.log("called loadUser");
    this.userService.loadUser();
    
  }

  getAllProjects() {

    this.projectService.getAllProjects().subscribe({
      next: (projects: Project[]) =>{
        this.projects = projects;
      },
      error: (error) =>{
        console.log(error);
        this.errorHandlerService.handleError(error);
      },
    })
  }


  doStuff(){
    console.log("do stuff");
    this.userService.loadUser();
  }

}
