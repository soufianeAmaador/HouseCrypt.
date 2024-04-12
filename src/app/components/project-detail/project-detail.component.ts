import { Component, OnInit, ViewChild } from '@angular/core';
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
      './assets/property1.jpg',
      './assets/property2.jpg',
      './assets/property3.jpg',
      './assets/property4.jpg',
      './assets/test.mp4',
    ];

  ngOnInit(): void {
  }

  submitPledge(pledgeAmount: number): void {
    this.pledgeAmount = pledgeAmount;
    console.log('Received Pledge Amount:', this.pledgeAmount);
    this.pledgeModal.hide();


  }

}
