import { Donation } from "./Donation";
import { FileReference } from "./FileReference";

export interface Project {
    projectId: string
    projectTitle: string;
    projectDescription: string;
    projectGoal: number;
    totalPledged: number;
    projectDeadline: Date; // You might want to use Date type if you parse it properly
    totalDonators: number;
    donations: Donation;
    projectPhotos: FileReference[]; 
    projectVideos: FileReference[]; 
    progress: number;
    user: string; // User ID
  }
