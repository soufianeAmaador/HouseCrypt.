import { Donation } from "./Donation";
import { Project } from "./Project";

export interface User {
  address: string;
  projects: Project[];
  donations: Donation[];
}
