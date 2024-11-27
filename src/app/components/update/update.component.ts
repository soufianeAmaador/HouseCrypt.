import { Component, Input, OnInit } from '@angular/core';
import { Update } from 'src/app/models/update';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit{
  @Input() update!: Update;
  updateMedia: string | undefined;
  constructor(private projectService: ProjectService){}

  ngOnInit(): void {
    this.setProfilePicture();
    
  }

  setProfilePicture(){
    const BASE_URL = this.projectService.getBaseUrl();
    if(this.update.photo !== undefined){
      this.updateMedia = BASE_URL + this.update.photo?.path;
    } else if(this.update.video !== undefined){
      this.updateMedia = BASE_URL + this.update.video?.path;
  }
  console.log(this.updateMedia);

  }

}
