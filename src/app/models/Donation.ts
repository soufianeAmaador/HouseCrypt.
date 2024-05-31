import { User } from "./User";

export interface Donation{
    user: User;
    project: string;
    amount: number;
    time: Date;
}
