export class Property {
    public key: any;
    public title: string;
    public images: string;
    public description: string;
    public bidding: Number[];
    public askingPrice: Number;

    constructor(key: string, title: string, images: string, description: string,bidding: Number[],askingPrice: number){
        this.key === key;
        this.title = title;
        this.images = images;
        this.description = description;
        this.bidding = bidding;
        this.askingPrice = askingPrice;
    }
    
}
