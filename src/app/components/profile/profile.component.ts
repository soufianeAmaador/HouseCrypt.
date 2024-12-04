import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/User';

import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/models/Project';
import { FileReference } from 'src/app/models/FileReference';
import { UpdateServiceService } from 'src/app/services/update-service.service';
import { Update } from 'src/app/models/update';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  walletAddress: string = "0x";
  autoChange: boolean = true;
  loadscreen: boolean = false;
  profileForm!: FormGroup;
  originalProfile!: User;
  formChanged = false;
  profilepicture: string = '';
  owner: boolean = false;

  updates: Update[] = [];
  projects: Project[] = projects;
  biddings: Project[] = biddings;

  user: User = {
    address: '',
    name: '',
    email: '',
    bio: '',
    projects: [],
    donations: []
  };


  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private updateService: UpdateServiceService, 
    private errorHandlerService: ErrorHandlerService,
    private fb: FormBuilder) {}

    ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        this.walletAddress = params.get('walletAddress') || '';    
        if (this.walletAddress) {
          this.handleUserLoading();
          this.loadUpdates();
        }
      });
    }
    
    // Handles determining if the current user is viewing their own profile or another user's profile
    private handleUserLoading() {
      if (this.walletAddress === this.userService.getUserAddress()) {
        this.owner=true;
        this.loadCurrentUser();
      } else {
        this.loadUserByWallet(this.walletAddress);
      }
    }
    
    // Loads the currently logged-in user's profile
    private loadCurrentUser() {
      console.log("loading current user");
      this.user = this.userService.getUser()!;
      if (!this.user) {
        this.loadscreen = false;
      } else {
        this.initializeProfile(this.user);
      }
    }
    
    // Fetches and loads another user's profile based on their wallet address
    private loadUserByWallet(walletAddress: string) {
      console.log("loaduser by wallet address");
      this.userService.getUserByWallet(walletAddress).subscribe({
        next: (user: User) => {
          this.initializeProfile(user);
        },
        error: (err) => {
          console.error("Error fetching user:", err);
        }
      });
    }
    
    // Initializes the profile data after successfully fetching a user
    private initializeProfile(user: User) {
      this.user = user;
      this.loadscreen = true;
      this.setProfilePicture();
      this.originalProfile = { ...user };
    
      // Initialize the reactive form with user data
      this.profileForm = this.fb.group({
        name: [{ value: this.originalProfile.name, disabled: true }],
        email: [{ value: this.originalProfile.email, disabled: true }],
        bio: [{ value: this.originalProfile.bio, disabled: true }],
        profilePicture: [this.originalProfile.profilePicture]
      });
    
      // Listen for form changes to detect modifications
      this.profileForm.valueChanges.subscribe(() => {
        this.formChanged = this.isChanged();
      });
    }

    loadUpdates() {
      console.log((this.walletAddress));
      if(this.walletAddress !== undefined && this.walletAddress.length > 5)
      this.updateService.getAllUpdatesOfUser(this.walletAddress).subscribe({
        next: (updates: Update[]) => {
          this.updates = updates;
        },
        error: (error) => {
          this.errorHandlerService.handleError(error);
        }
      });
    }
    

  setProfilePicture(){
    const BASE_URL = this.userService.getBaseUrl()
    if(this.user.profilePicture !== undefined){
      this.profilepicture = BASE_URL + this.user.profilePicture?.path;
    } else{
    console.log("profile not found!");
    this.profilepicture = 'https://via.placeholder.com/150';
  }

  }

  // Check if the form has been changed
  isChanged(): boolean {
    return this.deepCompareWithBigIntHandling(this.originalProfile, this.profileForm.value);
  }
  
  deepCompareWithBigIntHandling(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ) !== JSON.stringify(obj2, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
  }
  

  // Save the changes when the Save Changes button is clicked
  saveChanges() {
    if (this.formChanged) {
      // Update the original profile with the new form values
      this.originalProfile = this.profileForm.value;
      this.formChanged = false; // Reset the form changed state
      const formData = this.prepareFormData();
      this.userService.updateUserInfo(formData);
    }
  }

  prepareFormData(): FormData {
    const formData = new FormData();
    formData.append('name', this.profileForm.get('name')!.value);
    formData.append('email', this.profileForm.get('email')!.value);
    formData.append('bio', this.profileForm.get('bio')!.value);
    formData.append('profilePicture', this.profileForm.get('profilePicture')!.value);
    return formData;

  }


  // Toggle the edit mode for individual fields
  toggleEdit(field: 'name' | 'email' | 'bio') {
    const formControl = this.profileForm.get(field);
    if (formControl) {
      if (formControl.disabled) {
        formControl.enable();  // Enable the field
        const inputElement = document.getElementById(field) as HTMLInputElement | HTMLTextAreaElement;
        if (inputElement) {
          inputElement.focus();  // Set focus if the field is enabled
        }
      } else {
        formControl.disable();  // Disable the field again
      }
    }
  }

  // Trigger the file input when the pencil icon is clicked
  onEditPictureClick() {
    const fileInput = document.getElementById('profileImageUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click(); // Programmatically trigger the file input
    }
  }

  // Handle the selected image
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          // Update profilepicture with the base64 image URL
          this.profilepicture = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.profileForm.patchValue({ profilePicture: file });
        this.formChanged = true; // Mark form as changed
      }
    }
  }
}

const examplePhotos: FileReference[] = [
  {
    id: '1',
    filename: 'download.png',
    path: '\\uploads\\0x99119B2526dd23440Ea14f58c2b3DdBaC503806e\\images\\download.png',
    __v: 0
  },
  {
    id: '2',
    filename: 'pikaso_texttoimage_adorable-cartoon-style-Animated-Short-Film-Journey (1).jpeg',
    path: '\\uploads\\0x99119B2526dd23440Ea14f58c2b3DdBaC503806e\\images\\pikaso_texttoimage_adorable-cartoon-style-Animated-Short-Film-Journey (1).jpeg',
    __v: 0
  },
  {
    id: '3',
    filename: 'pikaso_texttoimage_adorable-cartoon-style-Animated-Short-Film-Journey (2).jpeg',
    path: '\\uploads\\0x99119B2526dd23440Ea14f58c2b3DdBaC503806e\\images\\pikaso_texttoimage_adorable-cartoon-style-Animated-Short-Film-Journey (2).jpeg',
    __v: 0
  }
];

export const projects: Project[] = [
  {
    projectId: '001',
    projectSCID: 1001,
    projectTitle: 'Community Garden',
    projectDescription: 'A project to build a community garden in the neighborhood.',
    projectGoal: '5000',
    projectDeadline: new Date('2024-12-31'),
    projectPhotos: examplePhotos,
    snippet: false,
    user: '0xABC123'
  },
  {
    projectId: '002',
    projectSCID: 1002,
    projectTitle: 'Solar Energy Initiative',
    projectDescription: 'Bringing solar energy to the local school.',
    projectGoal: '10000',
    projectDeadline: new Date('2024-11-15'),
    projectPhotos: examplePhotos,
    snippet: false,
    user: '0xDEF456'
  },
  {
    projectId: '003',
    projectSCID: 1003,
    projectTitle: 'Clean Water Project',
    projectDescription: 'Building water filtration systems in rural areas.',
    projectGoal: '7500',
    projectDeadline: new Date('2025-01-10'),
    projectPhotos: examplePhotos,
    snippet: false,
    user: '0xGHI789'
  },
  {
    projectId: '004',
    projectSCID: 1004,
    projectTitle: 'Tech for Kids',
    projectDescription: 'Providing computers for underprivileged children.',
    projectGoal: '6000',
    projectDeadline: new Date('2024-10-05'),
    projectPhotos: examplePhotos,
    snippet: false,
    user: '0xJKL101'
  },
  {
    projectId: '005',
    projectSCID: 1005,
    projectTitle: 'Art for All',
    projectDescription: 'Supporting community art programs.',
    projectGoal: '4000',
    projectDeadline: new Date('2024-12-01'),
    projectPhotos: examplePhotos,
    snippet: false,
    user: '0xMNO112'
  }
];

export const biddings: Project[] = [
  {
    projectId: '101',
    projectSCID: 2001,
    projectTitle: 'Street Art Mural',
    projectDescription: 'A bid to support a mural in downtown.',
    projectGoal: '3000',
    projectDeadline: new Date('2024-09-30'),
    projectPhotos: examplePhotos,
    snippet: false,
    user: '0xBID123'
  },
  {
    projectId: '102',
    projectSCID: 2002,
    projectTitle: 'Wildlife Conservation',
    projectDescription: 'A bid to protect endangered wildlife in the region.',
    projectGoal: '12000',
    projectDeadline: new Date('2025-02-20'),
    projectPhotos: examplePhotos,
    snippet: false,
    user: '0xBID456'
  },
  {
    projectId: '103',
    projectSCID: 2003,
    projectTitle: 'Eco-friendly Homes',
    projectDescription: 'Supporting the construction of eco-friendly homes.',
    projectGoal: '20000',
    projectDeadline: new Date('2025-03-15'),
    projectPhotos: examplePhotos,snippet: false,
    user: '0xBID789'
  },
  {
    projectId: '104',
    projectSCID: 2004,
    projectTitle: 'STEM Education for Girls',
    projectDescription: 'A bid to promote STEM education for girls.',
    projectGoal: '8000',
    projectDeadline: new Date('2024-11-01'),
    projectPhotos: examplePhotos,snippet: false,
    user: '0xBID101'
  },
  {
    projectId: '105',
    projectSCID: 2005,
    projectTitle: 'Music School Scholarship',
    projectDescription: 'A bid to offer scholarships to talented musicians.',
    projectGoal: '15000',
    projectDeadline: new Date('2024-10-20'),
    projectPhotos: examplePhotos,snippet: false,
    user: '0xBID112'
  }
];