import { Component, OnInit } from '@angular/core';
import { BathroomAmenities, PropertySpecs, Services, TypeOfHome, TypeOfRoof } from 'src/app/models/PropertySpecs';

@Component({
  selector: 'app-upload-property',
  templateUrl: './upload-property.component.html',
  styleUrls: ['./upload-property.component.scss']
})
export class UploadPropertyComponent implements OnInit {

  typeOfHome = TypeOfHome;
  typeOfRoof = TypeOfRoof;
  bathroomAmenities = BathroomAmenities;
  services = Services;

  typesOfHomes: string[];
  typesOfRoofs: string[];
  bathroomAmenitiesList: string[];
  servicesList: string[];

  constructor() {
    this.typesOfHomes = Object.values(this.typeOfHome);
    this.typesOfRoofs = Object.values(this.typeOfRoof);
    this.bathroomAmenitiesList = Object.values(this.bathroomAmenities);
    this.servicesList = Object.values(this.services); 
   }

  ngOnInit(): void {
  }

}
