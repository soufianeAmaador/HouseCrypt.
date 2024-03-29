import { Component, OnInit } from '@angular/core';
import { Property } from 'src/app/models/property';
import { PropertyService } from 'src/app/services/property-service.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {

  properties!: Property[];
  constructor(private propertyService: PropertyService) { }

  ngOnInit(): void {
    this.properties = Array.from(this.propertyService.getAllProperties().values()); 
  }

}
