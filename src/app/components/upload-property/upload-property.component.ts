/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BathroomAmenities, Services, TypeOfHome, TypeOfRoof } from 'src/app/models/PropertySpecs';

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

  selectedFiles: any[] = [];
  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;

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
    // this.imageInfos = this.uploadService.getFiles();

  }

  filesSelected(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
    
    this.previews = [];
    if(this.selectedFiles && this.selectedFiles[0]){
      const numberOfFiles = this.selectedFiles.length;
      for(let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
    
  }

  uploadFiles(): void {
    this.message = [];
  
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
  
    // if (file) {
    //   this.uploadService.upload(file).subscribe(
    //     (event: any) => {
    //       if (event.type === HttpEventType.UploadProgress) {
    //         this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
    //       } else if (event instanceof HttpResponse) {
    //         const msg = 'Uploaded the file successfully: ' + file.name;
    //         this.message.push(msg);
    //         this.imageInfos = this.uploadService.getFiles();
    //       }
    //     },
    //     (err: any) => {
    //       this.progressInfos[idx].value = 0;
    //       const msg = 'Could not upload the file: ' + file.name;
    //       this.message.push(msg);
    //     });
    // }
  }

}
