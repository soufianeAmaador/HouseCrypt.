import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-upload-project',
  templateUrl: './upload-project.component.html',
  styleUrls: ['./upload-project.component.css']
})
export class UploadProjectComponent implements OnInit {
  projectForm: FormGroup;
  selectedImage: string | null = null;
  selectedVideo: string | null = null;
  uploadedPhotos: File[] = [];
  uploadedVideos: File[] = [];
  


  image: string = './assets/artist-7250695_1280.jpg' 
  constructor(private formBuilder: FormBuilder, private cdr: ChangeDetectorRef){
    this.projectForm = this.formBuilder.group({
      projectTitle: ['', Validators.required],
      projectDescription: ['', Validators.required],
      projectGoal: [null, Validators.required],
      projectDeadline: ['', Validators.required],
      projectPhotos: [null],
      projectVideos: [null]
    })
  }

  ngOnInit(): void {
    this.cdr.detectChanges();

  }
  onFilesUploaded(files: { photos: File[], videos: File[] }) {
    this.uploadedPhotos = files.photos;
    this.uploadedVideos = files.videos;
  }
  
  onSubmit() {
    const formData = new FormData();
    formData.append('projectTitle', this.projectForm.get('projectTitle')!.value);
    formData.append('projectDescription', this.projectForm.get('projectDescription')!.value);
    formData.append('projectGoal', this.projectForm.get('projectGoal')!.value);
    formData.append('projectDeadline', this.projectForm.get('projectDeadline')!.value);

    for (const photo of this.uploadedPhotos) {
      formData.append('projectPhotos', photo);
    }

    for (const video of this.uploadedVideos) {
      formData.append('projectVideos', video);
    }

    formData.forEach((value: FormDataEntryValue, key: string) => {
      console.log(value, key);
    })

    // this.http.post('http://localhost:3000/api/projects', formData)
    //   .subscribe(response => {
    //     console.log('Form submission successful:', response);
    //   }, error => {
    //     console.error('Error submitting form:', error);
    //   });
  }

}
