import { Component, Input, OnInit } from '@angular/core';
import { Project } from 'src/app/models/Project';

@Component({
  selector: 'app-project-thumbnail',
  templateUrl: './project-thumbnail.component.html',
  styleUrls: ['./project-thumbnail.component.css']
})
export class ProjectThumbnailComponent implements OnInit{
  @Input() project: Project | undefined;
  @Input() autoChange: boolean = true;
  progress: number = 0;

  constructor(){
    
    
  }

  ngOnInit(): void {
      this.progress = this.calculateProgress(this.project!)  
    }
  

  calculateProgress(project: Project): number {
    let projectGoal: bigint;

    // Ensure projectGoal is a bigint
    if (typeof project.projectGoal === "bigint") {
        projectGoal = project.projectGoal;
    } else if (typeof project.projectGoal === "string" || typeof project.projectGoal === "number") {
        projectGoal = BigInt(project.projectGoal); // Convert to bigint if necessary
    } else {
        console.error("Invalid projectGoal type:", typeof project.projectGoal);
        return 0;
    }

    // Calculate total pledged as bigint
    const totalPledged = this.getTotalPledged(project);

    // Avoid division by zero
    if (totalPledged === BigInt(0) || projectGoal === BigInt(0)) {
        return 0;
    }

    // Perform percentage calculation using bigint
    const progressBigInt = (totalPledged * BigInt(100)) / projectGoal;

    // Convert bigint result back to number
    return Number(progressBigInt);
  }

  getTotalPledged(project: Project): bigint {
    let totalPledged: bigint = BigInt(0);

    if(project.donations !== undefined && project.donations.length > 0){
      project.donations!.forEach(donation => {
        // Ensure donation.amount is bigint
        const donationAmount = typeof donation.amount === 'bigint' ? donation.amount : BigInt(donation.amount);
        totalPledged += donationAmount;
      });
    }

    return totalPledged;
  }


}
