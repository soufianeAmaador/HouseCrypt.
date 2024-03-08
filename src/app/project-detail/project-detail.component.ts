import { Component } from '@angular/core';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent {
    // Array of image and video paths
    imagesAndVideos: string[] = [
      './assets/property1.jpg',
      './assets/property2.jpg',
      './assets/property3.jpg',
      './assets/property4.jpg',
    ];
}
