import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/Project';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Donation } from 'src/app/models/Donation';
import { EthereumService } from 'src/app/services/ethereum.service';
import { ethers } from 'ethers';
import Decimal from 'decimal.js';


@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit{
    @ViewChild('pledgeModal') pledgeModal: any;
    autoChange: boolean = false;
    pledgeAmount!: Decimal;
    totalPledged: bigint = 0n;
    totalPledgedEther: string = "";
    totalPledgedDollar:string = "";
    imagesAndVideos: string[] = [];
    project: Project | undefined = undefined;
    donations: Donation[] = [];
    projectId!: string | null;
    daysToGo: number = 0;

    constructor(private projectService: ProjectService,
      private ethereumService: EthereumService,
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
      this.loadDonations();
    }

  loadProject(){
    this.projectService.loadProject(this.projectId!).subscribe({
      next: (project) => {
        this.project = project;
        this.daysToGo = Math.ceil((new Date(this.project!.projectDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        this.loadMedia();
        console.log("project loaded!");
        console.log(this.project);

      },
      error: (error) => {
        console.log(error);
        this.errorHandlerService.handleError(error);
      }
    });
  }
  
  async loadDonations(){
    this.projectService.loadProjectDonations(this.projectId!).subscribe({
      next: async (donations: Donation[]) => {
        this.donations = donations;
        this.totalPledged = this.donations.reduce((total: bigint, donation) => {
          return total + BigInt(donation.amount);
        }, 0n);  // Initialize the total with bigint(0)
        this.totalPledgedEther = ethers.utils.formatUnits(this.totalPledged, "ether");
        this.totalPledgedDollar = await this.ethereumService.convertToDollars(this.totalPledged);
      },
      error: (error) => {this.errorHandlerService.handleError(error);}
    });
  }

  loadMedia(){
    this.imagesAndVideos = 
    [
      ...(this.imagesAndVideos || []),
      ...(this.project?.projectPhotos!.map(photo =>  photo.path) || []),
      ...(this.project?.projectVideos!.map(video =>  video.path) || [])
    ];
  }

  

  submitPledge(pledgeAmount: Decimal): void {
    this.pledgeAmount = pledgeAmount;
    const user = this.userService.getUser();

    console.log("subnmit pledge called pledgeamount: " + this.pledgeAmount + " user:  " + user);

    if(user === undefined || this.project === undefined || this.project.projectId === undefined){
      this.errorHandlerService.handleError("something went wrong! Try again later");
      return;
    }

    console.log("calling ethereumservice: " + pledgeAmount + "id: " + this.project.projectId);
    console.log(this.project);

    const weiAmount = this.ethereumService.convertToWei(this.pledgeAmount);

    console.log("wei amaount: " + weiAmount);

    // this.ethereumService.pledge(this.project.projectSCID!.toString(), weiAmount).then(() => {
    //   this.userService.addDonation({
    //     user: user.address,
    //     project: this.project!.projectId!,
    //     amount: weiAmount,
    //     time: new Date()
    //   });
    // }); 
    console.log("user address: ");
    console.log(user);
    console.log(user.address);
    this.userService.addDonation({
      user: user.address,
      project: this.project!.projectId!,
      amount: weiAmount.toString(),
      time: new Date()
    });
    

  }

  getTotalPledged(): bigint {
    return this.donations.reduce((total: bigint, donation) => {
      return total + BigInt(donation.amount);
    }, 0n);  // Initialize the total with bigint(0)
  }

  calculateProgress(): number {
    // Ensure that projectGoal is a bigint
    let projectGoal: bigint;
    if (typeof this.project!.projectGoal === "bigint") {
      projectGoal = this.project!.projectGoal;
    } else if (typeof this.project!.projectGoal === 'string' || typeof this.project!.projectGoal === 'number') {
      projectGoal = BigInt(this.project!.projectGoal);
    } else {
      console.error('Invalid projectGoal type:', typeof this.project!.projectGoal);
      return 0;
    }
    const totalPledged = this.getTotalPledged();
    if (totalPledged === BigInt(0)) {
      return 0; 
    }
  
    const progress = Number(((totalPledged*100n)/projectGoal)); 
  
    return progress;
  }
}

