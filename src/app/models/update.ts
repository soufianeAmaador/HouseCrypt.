import { FileReference } from "./FileReference";

export interface Update {
    title: string;
    description: string;
    dateTime: Date;
    project: string;
    owner: string;
    photo?: FileReference;
    video?: FileReference;
  }
  