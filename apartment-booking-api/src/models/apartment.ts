import User, {UserParams} from "./user";

export interface ApartmentParams {
    id?: number;
    unitName: string;
    unitNumber: string;
    project: string;
    description: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    available?: boolean;
    features?: string[];
    images?: string[];
    ownerId: number;
    owner: UserParams;
    createdAt?: Date;
    updatedAt?: Date;
}

export default class Apartment {
    id?: number;
    unitName: string;
    unitNumber: string;
    project: string;
    description: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    available: boolean;
    features: string[];
    images: string[];
    ownerId: number;
    owner: User;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(params: ApartmentParams) {
        this.id = params.id;
        this.unitName = params.unitName;
        this.unitNumber = params.unitNumber;
        this.project = params.project;
        this.description = params.description;
        this.price = params.price;
        this.location = params.location;
        this.bedrooms = params.bedrooms;
        this.bathrooms = params.bathrooms;
        this.area = params.area;
        this.available = params.available ?? true;
        this.features = params.features ?? [];
        this.images = params.images ?? [];
        this.ownerId = params.ownerId;
        this.owner = new User(params.owner);
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
    }

    static validate(data: ApartmentParams): string | null {
        const requiredFields: (keyof ApartmentParams)[] = [
            'unitName',
            'unitNumber',
            'project',
            'description',
            'price',
            'location',
            'bedrooms',
            'bathrooms',
            'area',
            'ownerId'
        ];

        for (const field of requiredFields) {
            const value = data[field];
            if (value === undefined || value === null || value === '') {
                return `${field} is required.`;
            }
        }

        if (data.price <= 0) {
            return 'Price must be a positive number.';
        }

        if (data.area <= 0) {
            return 'Area must be a positive number.';
        }

        return null;
    }

    toObject(): ApartmentParams {
        return { ...this };
    }

    serializedObject(): Partial<ApartmentParams> {
        return {
            id: this.id,
            unitName: this.unitName,
            unitNumber: this.unitNumber,
            project: this.project,
            price: this.price,
            location: this.location,
            bedrooms: this.bedrooms,
            bathrooms: this.bathrooms,
            area: this.area,
            available: this.available,
            images: this.images,
            features: this.features,
            owner: this.owner.serializedObject(),
        };
    }
}
