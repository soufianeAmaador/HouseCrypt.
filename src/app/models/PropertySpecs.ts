
export class PropertySpecs {

    constructor(
        readonly askingPrice: number,
        readonly pricePerM2: number,
        readonly advertisedSince: Date,
        readonly status: Status,
        readonly admission: string,
        readonly typeOfHome: TypeOfHome,
        readonly dateOfBuild: string,
        readonly typeOfRoof: TypeOfRoof,
        readonly livingSpace: number,
        readonly otherIndoorSpace: number,
        readonly brOutdoorSpace: number,
        readonly externalStorageSpace: number,
        readonly plot: number,
        readonly capacity: number,
        readonly amountRooms: number,
        readonly amountBathroom: number,
        readonly bathroomAmenities: BathroomAmenities[],
        readonly numberOfFloors: number,
        readonly services: Services

    ){}


}

export enum Status {
    AVAILABLE = "Available", 
    SOLD = "Sold", 
    IN_DISCUSSION = "In discussion",
}

export enum TypeOfHome {
    RESIDENTIAL = "Residential",
    APARTMENT = "Appartment",
    PARKING = "Parking",
    BUILDING = "Building",
    STORAGE = "Storage",
    OTHER = "Other"

}

export enum TypeOfRoof {
    GABLE_ROOF = "Gable roof",
    CLIPPED_GABLE_ROOF = "Clipped gable roof",
    DUTCH_GABLED_ROOF = "Dutch gabled roof",
    GAMBREL_ROOF = "Gambrel roof",
    HIP_ROOF = "Hip roof",
    MANSARD_ROOF = "Mansard roof",
    SHED_ROOF = "Shed roof",
    FLAT_ROOF = "Flat roof",
    OTHER = "Other"
}

export enum BathroomAmenities {
    BATHTUB =  "Bathtub",
    SHOWER = "Shower",
    TOILET = "Toilet",
    Heater = "Heater",
    JACUZZI = "Jacuzzi",
    SAUNA = "Sauna",
}

export enum Services {
    AIR_CONDITIONING = "Air conditioning",
    FIBER_OPTIC = "Fiber optic",
    VENTILATION = "Ventilation",
    BOILER = "Boiler",
    POOL = "Pool",
    ELEVATOR = "Elevator",
    STORAGE = "Storage space"
}