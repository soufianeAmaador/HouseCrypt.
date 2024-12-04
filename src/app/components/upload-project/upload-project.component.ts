import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { ProjectService } from 'src/app/services/project.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { Router } from '@angular/router';
import { EthereumService } from 'src/app/services/ethereum.service';
import { Project } from 'src/app/models/Project';
import { FileReference } from 'src/app/models/FileReference';


@Component({
  selector: 'app-upload-project',
  templateUrl: './upload-project.component.html',
  styleUrls: ['./upload-project.component.css']
})
export class UploadProjectComponent implements OnInit {
  projectForm: FormGroup;
  project: Project | undefined;

  selectedImage: string | null = null;
  selectedVideo: string | null = null;

  uploadedPhotos: File[] = [];
  uploadedVideos: File[] = [];

  pledgeAmount!: number;
  etherAmount: string = '';
  weiAmount: string = '';
  


  image: string = './assets/artist-7250695_1280.jpg' 
  constructor(private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef, 
    private projectService: ProjectService,
    private ethereumService: EthereumService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router){
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


createProjectObject(formData: FormData){
  if(formData.get('projectTitle') != null &&  formData.get('projectGoal') != null &&
    formData.get('projectDeadline') != null){
      this.project = {
        projectTitle: formData.get('projectTitle')?.valueOf() as string,
        projectDescription: formData.get('projectDescription')?.valueOf() as string,
        projectGoal: formData.get('projectGoal')?.valueOf() as string,
        projectDeadline: formData.get('projectDeadline')?.valueOf() as Date,
        projectPhotos: formData.get('projectPhotos')?.valueOf() as FileReference[],
        projectVideos: formData.get('projectVideos')?.valueOf() as FileReference[],
        snippet: false

      }
    }else return null;
    return this.project;
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
  this.createProjectObject(formData);


  if(this.projectForm.valid && this.project !== undefined && this.project !== null){
    this.ethereumService.createProject({
      projectTitle: this.project.projectTitle,
      projectDescription: this.project.projectDescription,
      projectGoal: this.weiAmount,
      projectDeadline: this.project.projectDeadline,
      snippet: false
    }).then((projectSC) => {
      console.log("project version: " + projectSC);
      console.log("test " + parseInt(projectSC, 16));
      this.project!.projectSCID = parseInt(projectSC, 16);
      this.projectService.uploadProject(formData).subscribe({
        next: () => {this.handleUploadResponse();
          //temporarily until i fix the ethereum smart contract handling
          this.router.navigate(['/']);
        },
        error: (error) => this.handleUploadError(error)
      });
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
 
async convertAmount() {
  if(this.projectForm.get('projectGoal')!.dirty && this.projectForm.get('projectGoal')?.valid && this.projectForm.get('projectGoal')!.value > 0){
    this.etherAmount = await this.ethereumService.convertToEther(this.projectForm.get('projectGoal')!.value);
    this.weiAmount = this.ethereumService.convertToWei(this.projectForm.get('projectGoal')!.value).toString();
  }
}

}
