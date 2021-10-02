import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import properties from 'src/assets/testData.json';
import { Property } from '../models/property';
 

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  properties: Map<string, Property> = new Map<string,Property>();


  constructor() {
    
    this.populateScreen();
   }

  public populateScreen() {
     
    for (let i = 0; i < properties.length; i++) {
      this.properties.set(i.toString(), new Property(i.toString(), properties[i].title, properties[i].image, properties[i].description, <Number[]>[], properties[i].price, properties[i].biddings));

    }
  }

  getAllProperties(): Map<string, Property> {
    return this.properties;
  }
}
