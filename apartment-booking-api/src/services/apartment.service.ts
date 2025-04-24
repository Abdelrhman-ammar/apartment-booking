import prisma from '../prisma/client';
import Apartment, { ApartmentParams } from '../models/apartment';
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

  async getAllApartments() {
    const apartments = await this.getAllApartmentObjects();
    return generateResponse({
      status: statusCodes.OK,
      data: apartments.map((a: Apartment) => a.serializedObject()),
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

  async updateApartment(id: number, data: Partial<ApartmentParams>, userId: number, userRole: string) {
    const whereCondition = userRole === 'ADMIN' ? { id } : { id, ownerId: userId };
    const apartment = await prisma.apartment.findUnique({ where: whereCondition });
    if(!apartment) {
      return this.handleAuth(id);
    }
    const updated = await prisma.apartment.update({ where: { id }, data, include: { owner: true }});
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
  

  async getAllApartmentObjects() {
    const apartments = await prisma.apartment.findMany({ include: { owner: true } });
    return apartments.map((a: ApartmentParams) => new Apartment(a));
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
    const apartment = new Apartment(data);
    const created = await prisma.apartment.create({ data: apartment.toObject() });
    return new Apartment(created);
  }
}
