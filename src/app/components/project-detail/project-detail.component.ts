import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/Project';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Donation } from 'src/app/models/Donation';
import { EthereumService } from 'src/app/services/ethereum.service';
import { ethers } from 'ethers';
import Decimal from 'decimal.js';
import { forkJoin, of, switchMap } from 'rxjs';
import { UpdateServiceService } from 'src/app/services/update-service.service';
import { Update } from 'src/app/models/update';
import { PledgeModalComponent } from '../pledge-modal/pledge-modal.component';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  @ViewChild('pledgeModal')
  pledgeModal!: PledgeModalComponent;
  autoChange: boolean = false;
  pledgeAmount!: Decimal;
  totalPledged: bigint = 0n;
  totalPledgedEther: string = "";
  totalPledgedDollar: string = "";
  imagesAndVideos: string[] = [];
  project: Project | undefined = undefined;
  donations: Donation[] = [];
  projectId!: string | null;
  daysToGo: number = 0;
  owner: boolean = false;
  editedDescription: string = '';
  loadscreen: boolean = false;
  updates: Update[] = updates;
  uploadedPhotos: File[] = [];
  uploadedVideos: File[] = [];

  // FormGroup for handling form inputs
  projectForm!: FormGroup;
  updateForm!: FormGroup;
  formChanged = false;

  constructor(
    private projectService: ProjectService,
    private ethereumService: EthereumService,
    private updateService: UpdateServiceService,
    private userService: UserService,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.queryParamMap.get('id');
    if (this.projectId == null || this.projectId === "") {
      this.router.navigate(['/']);
      this.errorHandlerService.handleError("Project not found!");
    }

    // Initialize the form
    this.projectForm = this.formBuilder.group({
      projectTitle: [''],
      projectDescription: ['']
    });

     // Load both user and project in parallel
    this.loadUserAndProject();

    this.projectForm.valueChanges.subscribe(() => {
      this.formChanged = this.isChanged();
    });
  }
  
  loadUserAndProject() {

    this.userService.isLoggedIn().pipe(
      switchMap((isUserLoggedIn) => {
        const user$ = isUserLoggedIn ? this.userService.loadUser() : of(undefined); // Conditional Observable for user
        const project$ = this.projectService.loadProject(this.projectId!);
  
        return forkJoin([user$, project$]);
      })
    ).subscribe({
      next: ([user, project]) => {
        this.project = project;
        this.owner = user !== undefined && user.address === project.user; // Check ownership
  
        // Set days to go and load media only after project is loaded
        this.daysToGo = Math.ceil(
          (new Date(this.project.projectDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        this.loadMedia();
  
        // Populate form with project details
        this.projectForm.patchValue({
          projectTitle: this.project.projectTitle,
          projectDescription: this.project.projectDescription,
        });
        this.loadDonations();
        this.loadUpdates();
        this.loadscreen = true;
      },
      error: (error) => {
        console.log(error);
        this.errorHandlerService.handleError(error);
      }
    });
  }

  loadMedia() {
    this.imagesAndVideos = [
      ...(this.imagesAndVideos || []),
      ...(this.project?.projectPhotos!.map((photo) => photo.path) || []),
      ...(this.project?.projectVideos!.map((video) => video.path) || [])
    ];
  }

  loadingDonations: boolean = true;

  async loadDonations() {
    if (this.project?.projectId) {
      this.loadingDonations = true;
      this.projectService.loadProjectDonations(this.projectId!).subscribe({
        next: async (donations: Donation[]) => {
          this.donations = donations;
          this.totalPledged = donations.reduce((total: bigint, donation) => total + BigInt(donation.amount), 0n);
          this.totalPledgedEther = ethers.utils.formatUnits(this.totalPledged, "ether");
          this.totalPledgedDollar = await this.ethereumService.convertToDollars(this.totalPledged);
          this.loadingDonations = false;
        },
        error: (error) => {
          this.errorHandlerService.handleError(error);
          this.loadingDonations = false;
        },
      });
    }
  }

  onFilesUploaded(files: { photos: File[], videos: File[] }) {
    console.log(this.uploadedPhotos)
    console.log(this.uploadedVideos)
    this.uploadedPhotos = files.photos;
    this.uploadedVideos = files.videos;
  }


  //TODO: Sort them ascending
  loadUpdates() {
    console.log((this.project !== undefined && this.project.projectId != undefined));
    if(this.project !== undefined && this.project.projectId != undefined)
    this.updateService.getAllUpdatesOfProject(this.project!.projectId!).subscribe({
      next: (updates: Update[]) => {
        this.updates = updates;
      },
      error: (error) => {
        this.errorHandlerService.handleError(error);
      }
    });
  }


  submitPledge(pledgeAmount: Decimal): void {
    this.pledgeAmount = pledgeAmount;
    const user = this.userService.getUser();

    if (user === undefined || this.project === undefined || this.project.projectId === undefined) {
      this.errorHandlerService.handleError("Something went wrong! Try again later.");
      return;
    }

    const weiAmount = this.ethereumService.convertToWei(this.pledgeAmount);

    this.userService.addDonation({
      user: user.address,
      project: this.project!.projectId!,
      amount: weiAmount.toString(),
      time: new Date()
    }).then(()=>{
      this.closeModal();

    }).catch((error)=>{
      this.errorHandlerService.handleError(error);
    })

  }

  closeModal(){
    this.pledgeModal.closeModal();
  }

  getTotalPledged(): bigint {
    return this.donations.reduce((total: bigint, donation) => {
      return total + BigInt(donation.amount);
    }, 0n);
  }

  calculateProgress(): number {
    let projectGoal: bigint;

    if (typeof this.project!.projectGoal === "bigint") {
      projectGoal = this.project!.projectGoal;
    } else if (typeof this.project!.projectGoal === 'string' || typeof this.project!.projectGoal === 'number') {
      projectGoal = BigInt(this.project!.projectGoal);
    } else {
      console.error('Invalid projectGoal type:', typeof this.project!.projectGoal);
      return 0;
    }

    const totalPledged = this.getTotalPledged();
    if (totalPledged === BigInt(0)) {
      return 0;
    }

    return Number((totalPledged * 100n) / projectGoal);
  }
  
  saveChanges(): void {
    if (!this.projectForm.valid || !this.project) return;

    const updatedProject = {
      ...this.project,
      ...this.projectForm.value
    };

    this.projectService.updateProject(updatedProject);
  }

  isChanged(): boolean {
    const title = this.projectForm.get("projectTitle")?.getRawValue() as string;
    const description = this.projectForm.get("projectDescription")?.getRawValue() as string;

    const result = ((title !== this.project?.projectTitle) || (description !== this.project.projectDescription));
    return result;
  }

  newUpdate = {
    title: '',
    description: '',
    dateTime: new Date(),
    project: '', // Set default values
    owner: '',
  };

  addUpdate() { 
    // Check if all required fields are populated
    if (
      this.newUpdate.title && 
      this.newUpdate.title.length > 5 && 
      this.newUpdate.description.length > 10 && 
      this.project && 
      this.project.projectId && 
      this.project.user
    ) {
      const update: any = {
        ...this.newUpdate,
        dateTime: new Date(),
        project: this.project!.projectId!,
        owner: this.project!.user!,
        photo: this.uploadedPhotos.length > 0 ? this.uploadedPhotos[0] : undefined,
        video: this.uploadedVideos.length > 0 ? this.uploadedVideos[0] : undefined,
      };

      const formData = this.prepareFormData(update);

      console.log("New update added:", formData);

      this.projectService.uploadUpdate(formData)
      .subscribe({
        next: (update: Update) => {
          console.log("update Upload succcessvul");
          this.updates.push(update);
        },
        error: (error) => {
          console.log(error);
          this.errorHandlerService.handleError(error)
        }
      });
  
      // Clear the form fields
      this.newUpdate.title = '';
      this.newUpdate.description = '';
    }else{
      console.log("smthng is false");
    }
  }

  prepareFormData(update: any): FormData {
    const formData = new FormData();
    formData.append('title', update.title),
    formData.append('description', update.description),
    formData.append('dateTime', update.dateTime.toISOString()),
    formData.append('project', update.project),
    formData.append('owner', update.owner );

    if(update.photo !== undefined){
        formData.append('photo', update.photo);
    }else if(update.video !== undefined){
        formData.append('video', update.video);
    }

    return formData;
  }
}

const updates: Update[] = [];

// const updates: Update[] = [
//   {
//     title: 'Update 1',
//     description: 'This is a description for update 1.',
//     dateTime: new Date('2024-09-29T13:30:58'),
//     project: 'project_1',
//     owner: 'user_2'
//   },
//   {
//     title: 'Update 2',
//     description: 'This is a description for update 2.',
//     dateTime: new Date('2024-10-10T13:30:58'),
//     project: 'project_2',
//     owner: 'user_2'
//   },
//   {
//     title: 'Update 3',
//     description: 'This is a description for update 3.',
//     dateTime: new Date('2024-10-09T13:30:58'),
//     project: 'project_3',
//     owner: 'user_3'
//   },
//   {
//     title: 'Update 4',
//     description: 'This is a description for update 4.',
//     dateTime: new Date('2024-09-28T13:30:58'),
//     project: 'project_4',
//     owner: 'user_1'
//   },
//   {
//     title: 'Update 5',
//     description: 'This is a description for update 5.',
//     dateTime: new Date('2024-09-26T13:30:58'),
//     project: 'project_5',
//     owner: 'user_3'
//   }
// ];
