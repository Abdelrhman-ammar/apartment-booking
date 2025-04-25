import prisma from '../prisma/client';
import Apartment, { ApartmentParams, ApartmentSmallSelect } from '../models/apartment';
import { generateResponse } from '../utils/response';
import { statusCodes } from '../utils/status-responses';
import { ValidationObject } from "../types/validation-object";

export class ApartmentService {
  static validate(data: ApartmentParams): ValidationObject {
    const error = Apartment.validate(data);
    return {
      valid: !error,
      response: error
          ? generateResponse({ status: statusCodes.BAD_REQUEST, error })
          : null,
    };
  }

  async getAllApartments(page: number, limit: number) {
    const apartments = await this.getAllApartmentObjects(page, limit);
    return generateResponse({
      status: statusCodes.OK,
      data: apartments.map((a: Apartment) => a.miniSerializedObject()),
    });
  }

  async getApartmentById(id: number) {
    if (isNaN(id)) {
      return generateResponse({
        status: statusCodes.BAD_REQUEST,
        message: "ID must be a number",
      });
    }

    const apartment = await this.getApartmentObjectById(id);
    const status = apartment ? statusCodes.OK : statusCodes.NOT_FOUND;

    return generateResponse({
      status,
      data: apartment?.serializedObject() ?? null,
    });
  }

  async createApartment(data: ApartmentParams) {
    const apartment = await this.createApartmentObject(data);
    return generateResponse({
      status: statusCodes.CREATED,
      data: apartment?.serializedObject(),
    });
  }

  async filterApartments(filters: any) {
    const where: any = {};
  
    if (filters.unitName) where.unitName = { contains: filters.unitName, mode: 'insensitive' };
    if (filters.location) where.location = { contains: filters.location, mode: 'insensitive' };
    if (filters.minPrice) where.price = { gte: Number(filters.minPrice) };
    if (filters.maxPrice) where.price = { ...where.price, lte: Number(filters.maxPrice) };
    if (filters.bedrooms) where.bedrooms = Number(filters.bedrooms);
    if (filters.bathrooms) where.bathrooms = Number(filters.bathrooms);
    if (filters.available !== undefined) where.available = filters.available === true || filters.available === 'true';
    if (filters.minArea) where.area = { gte: Number(filters.minArea) };
    if (filters.maxArea) where.area = { ...where.area, lte: Number(filters.maxArea) };
    if (filters.features) {
      const featureArray = Array.isArray(filters.features)
        ? filters.features
        : filters.features.split(',');
      where.features = { hasSome: featureArray };
    }
  
    const apartments = await prisma.apartment.findMany({
      where,
      include: { owner: true },
    });
  
    return generateResponse({
      status: statusCodes.OK,
      data: apartments.map((a: any) => new Apartment(a).serializedObject()),
    });
  }

  async updateApartment(id: number, data: ApartmentParams, userId: number, userRole: string) {
    const whereCondition = userRole === 'ADMIN' ? { id } : { id, ownerId: userId };
    const apartment = await prisma.apartment.findUnique({ where: whereCondition });
    if(!apartment) {
      return this.handleAuth(id);
    }
    const object = new Apartment(apartment);
    const updated = await prisma.apartment.update({ where: { id },
      data: object.toUpdateObject(),
      include: { owner: true }}
    );
    return generateResponse({
      status: statusCodes.OK,
      data: new Apartment(updated).serializedObject(),
    });
  }

  async deleteApartment(id: number, userId: number, userRole: string) {
    const whereCondition = userRole === 'ADMIN' ? { id } : { id, ownerId: userId };
    const deleteResult = await prisma.apartment.deleteMany({ where: whereCondition });
    if (deleteResult.count === 0) {
      return this.handleAuth(id);
    }
    return generateResponse({ status: statusCodes.NO_CONTENT, data: null });
  }

  async handleAuth(id: number ) {
    const exists = await prisma.apartment.findUnique({ where: { id } });
    return generateResponse({
      status: exists ? statusCodes.FORBIDDEN : statusCodes.NOT_FOUND,
      message: exists
          ? 'You are not authorized to this apartment'
          : 'Apartment not found'
    });
  }
  

  async getAllApartmentObjects(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const apartments = await prisma.apartment.findMany({ skip, take: limit, select: ApartmentSmallSelect });
    return apartments.map((a) => Apartment.fromSmallData(a));
  }

  async getApartmentObjectById(id: number) {
    const apartment = await prisma.apartment.findUnique({
      where: { id },
      include: { owner: true },
    });
    return apartment ? new Apartment(apartment) : null;
  }

  async createApartmentObject(data: ApartmentParams) {
    Apartment.validate(data);
    const apartment = new Apartment(data)
    delete apartment.owner
    const created = await prisma.apartment.create({ data: apartment.toCreateObject() });
    return new Apartment(created);
  }
}
