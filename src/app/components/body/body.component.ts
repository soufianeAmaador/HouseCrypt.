import { Component, OnInit } from '@angular/core';
import { Property } from 'src/app/models/property';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/Project';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UserService } from 'src/app/services/user.service';
import { EthereumService } from 'src/app/services/ethereum.service';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {

  properties!: Property[];
  projects: Project[] | undefined;
  autoChange: boolean = true;

  constructor(
    private ethereumService: EthereumService,
    private projectService: ProjectService,
    private errorHandlerService: ErrorHandlerService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getAllProjects();  
  }

  getAllProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (projects: any[]) => {  
        // Now, populate the projects and projectsWithProgress arrays
        this.projects = projects;
      },
      error: (error) => {
        console.log(error);
        this.errorHandlerService.handleError(error);
      },
    });
  }
  


  async doStuff() {
    console.log("do stuff");
    // const today = new Date();
    // const nextYear = new Date(today);
    // nextYear.setFullYear(today.getFullYear() + 1);

    // this.ethereumService.createProject({
    //   projectId: "66314fd19ce5fddf81b1f3fa",
    //   projectTitle: "Animated Short Film: Journey of the Forgotten",
    //   projectDescription: "Join us on an immersive journey through a forgotten world brought to life through stunning animation.",
    //   projectGoal: "3274394000000000000", // 3.274394 ETH in wei
    //   projectDeadline: nextYear,
    //   donations: [],
    //   projectPhotos: [],
    //   projectVideos: [],
    //   user: ""
    // });
    const dollarsConverted = await this.ethereumService.convertToEther(new Decimal(2407));
    console.log("dollarsConverted");
    console.log(dollarsConverted);
  }
}
