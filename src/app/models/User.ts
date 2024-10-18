import { Donation } from "./Donation";
import { FileReference } from "./FileReference";
import { Project } from "./Project";

export interface User {
  address: string;
  name: string;
  email: string;
  bio:string;
  profilePicture?:  FileReference; 
  projects: Project[];
  donations: Donation[];
}
