import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { UploadProjectService } from 'src/app/services/upload-project.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

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
  constructor(private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef, 
    private uploadProjectService: UploadProjectService,
    private errorHandlerService: ErrorHandlerService){
    this.projectForm = this.formBuilder.group({
      projectTitle: ['', Validators.required],
      projectDescription: ['', Validators.required],
      projectGoal: [null, [Validators.required, this.zeroOrPositiveValidator()]],
      projectDeadline: ['', [Validators.required, this.futureDateValidator()]],
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
  
// Function to prepare form data
prepareFormData(): FormData {
  const formData = new FormData();
  formData.append('projectTitle', this.projectForm.get('projectTitle')!.value);
  formData.append('projectDescription', this.projectForm.get('projectDescription')!.value);
  formData.append('projectGoal', this.projectForm.get('projectGoal')!.value);
  formData.append('projectDeadline', this.projectForm.get('projectDeadline')!.value);

  for (const photo of this.uploadedPhotos) {
    console.log(photo.name);
    formData.append('projectPhotos', photo);
  }

  for (const video of this.uploadedVideos) {
    formData.append('projectVideos', video);
  }

  return formData;
}

// Function to handle response from backend
handleUploadResponse(): void {
  console.log('Upload successful:');
  // Handle successful response from backend
}

// Function to handle error from backend
handleUploadError(error: any): void {
  console.error('Error uploading project:', error);
  // Handle error response from backend
  this.errorHandlerService.handleError(JSON.parse(JSON.stringify(error.error)));
}

// Main function for submitting the form
onSubmit(): void {
  const formData = this.prepareFormData();
  if(this.projectForm.valid){
      // Example: Sending projectFormData to the service for uploading
  this.uploadProjectService.uploadProject(formData).subscribe({
    next: () => this.handleUploadResponse(),
    error: (error) => this.handleUploadError(error)
  });
  }else{
    this.errorHandlerService.handleError("Form is incorrect, please fill the form correctly");
  }
}

zeroOrPositiveValidator() {
  return (control: { value: number }) => {
    if (control.value !== null && (isNaN(control.value) || control.value < 0)) {
      return { 'invalidAmount': true };
    }
    return null;
  };
}

futureDateValidator() {
  return (control: AbstractControl) => {
    const selectedDate: Date = new Date(control.value);
    const currentDate = new Date();
    
    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
        
    if (selectedDate <= currentDate) {
      return { 'futureDate': true }; 
    }
    return null;
  };
}

}
