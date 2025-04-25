import { Prisma } from "@prisma/client";
import User, {UserParams} from "./user";
export const ApartmentSmallSelect: Prisma.ApartmentSelect = {
    id: true,
    unitName: true,
    project: true,
    location: true,
    price: true,
    images: true,
    available: true
};

const defaultApartmentParams: ApartmentParams = {
    id: 0,
    unitName: '',
    unitNumber: '',
    project: '',
    description: '',
    location: '',
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    images: [],
    available: true,
    ownerId: 0,
    owner: undefined,
};

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
    owner?: UserParams;
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
    owner?: User;
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
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        if (params.owner) {
            this.owner = new User(params.owner);
        }
    }

    // small constructor
    static fromSmallData(data: Partial<ApartmentParams>) {
        return new Apartment({ ...defaultApartmentParams, ...data });
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

    toUpdateObject(): Prisma.ApartmentUpdateInput {
        return {
            ...this.getCommonProperties(),
            owner: { connect: { id: this.ownerId } },
        };
    }
    
    toCreateObject(): Prisma.ApartmentCreateInput {
        return {
            ...this.getCommonProperties(),
            owner: { connect: { id: this.ownerId } },
        };
    }
    
    serializedObject(): Partial<ApartmentParams> {
        return {
            id: this.id,
            ...this.getCommonProperties(),
            owner: this.owner?.serializedObject(),
        };
    }

    miniSerializedObject(): Partial<ApartmentParams> {
        return {
            id: this.id,
            unitName: this.unitName,
            location: this.location,
            price: this.price,
            images: this.images,
        };
    }

    private getCommonProperties() {
        return {
            unitName: this.unitName,
            unitNumber: this.unitNumber,
            description: this.description,
            project: this.project,
            price: this.price,
            location: this.location,
            bedrooms: this.bedrooms,
            bathrooms: this.bathrooms,
            area: this.area,
            available: this.available,
            images: this.images,
            features: this.features,
        };
    }
}
