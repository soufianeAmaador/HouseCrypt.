import { Component, Input, OnInit } from '@angular/core';
import { Project } from 'src/app/models/Project';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  carouselItems: string[] = [];
  @Input() project: Project | undefined;
  @Input() autoChange: boolean = false;

  
  constructor(private authService: AuthService){}
  ngOnInit(): void {
    this.loadMedia()

  }

  loadMedia(){
    const BASE_URL = this.authService.getBaseUrl();
    if(this.project !== undefined){
            // Concatenate paths from both photo and video arrays
      this.carouselItems = this.carouselItems.concat(this.project.projectPhotos.map(photo =>   BASE_URL +photo.path));
      this.carouselItems = this.carouselItems.concat(this.project.projectVideos.map(video =>   BASE_URL +video.path));
    }

  }
}