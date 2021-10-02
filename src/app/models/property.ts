import { Bidder } from "./Bidder";

export class Property {

    constructor(
        readonly key: string, 
        readonly title: string, 
        readonly images: string, 
        readonly description: string, 
        readonly bidding: Number[], 
        readonly askingPrice: number, 
        readonly biddings: Bidder[]
        ){}

}
