import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import properties from 'src/assets/testData.json';
import { Property } from '../models/property.model';
 

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  map: Map<string, Property> = new Map<string,Property>();

  constructor() {
    
    this.populateScreen();
   }

  public populateScreen() {
     
    for (let i = 0; i < properties.length; i++) {
      this.map.set(i.toString(), new Property(i.toString(), properties[i].title, properties[i].image, properties[i].description, <Number[]>[], properties[i].price));
    }
  }

  getAllProperties(): Property[] {
    return Array.from (this.map.values());
  }
}
