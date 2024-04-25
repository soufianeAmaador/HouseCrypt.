import { Component, Input, OnInit } from '@angular/core';
import { Project } from 'src/app/models/Project';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  @Input() carouselItems: string[] = [];
  @Input() project: Project | undefined;


  ngOnInit(): void {
  }


}
