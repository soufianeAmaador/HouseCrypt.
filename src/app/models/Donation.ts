export interface Donation{
    id?: string; //TODO make sure id is loaded
    user: string;
    project: string;
    amount: string; // Amount in wei
    time: Date;
}
