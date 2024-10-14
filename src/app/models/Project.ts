import { Donation } from "./Donation";
import { FileReference } from "./FileReference";

export interface Project {
    projectId?: string,
    projectSCID?: number,
    projectTitle: string;
    projectDescription: string;
    projectGoal: string;
    projectDeadline: Date;
    donations?: Donation[];
    projectPhotos?: FileReference[]; 
    projectVideos?: FileReference[]; 
    user?: string; // Wallet Address
  }

  export interface ProjectWithProgress {
    project: Project;         // The original project object
    progress: number;         // Progress as a percentage (0-100)
  }