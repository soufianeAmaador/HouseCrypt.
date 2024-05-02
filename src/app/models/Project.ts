import { FileReference } from "./FileReference";

export interface Project {
    projectId: string
    projectTitle: string;
    projectDescription: string;
    projectGoal: number;
    totalPledged: number;
    projectDeadline: Date; // You might want to use Date type if you parse it properly
    totalDonators: number;
    projectPhotos: FileReference[]; 
    projectVideos: FileReference[]; 
    user: string; // User ID
  }
