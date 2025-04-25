import { Request, Response } from 'express';
import { ApartmentService } from '../services/apartment.service';
import { sendGeneralErrorResponse } from '../utils/response';
import { ValidationObject } from '../types/validation-object';
import {UserParams} from "../models/user";

const apartmentService = new ApartmentService();

export const createApartment = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body, ownerId: req.body.user.id };
    const validationObject: ValidationObject = ApartmentService.validate(data);
    let response = validationObject.response;

    if (validationObject.valid) {
      response = await apartmentService.createApartment(data);
    }

    res.status(response?.status || 500).json(response);
  } catch (error) {
    sendGeneralErrorResponse(res);
    console.error(error);
  }
};

export const getApartments = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.body.page) || 1, 1)
    const limit = Math.min(Number(req.body.limit) || 10, 50)
    const response = await apartmentService.getAllApartments(page, limit);
    res.status(response.status).json(response);
  } catch (error) {
    sendGeneralErrorResponse(res);
    console.error(error);
  }
};

export const getApartment = async (req: Request, res: Response) => {
  try {
    const apartmentId = Number(req.params.id);
    const response = await apartmentService.getApartmentById(apartmentId);
    res.status(response.status).json(response);
  } catch (error) {
    sendGeneralErrorResponse(res);
    console.error(error);
  }
};

export const filterApartments = async (req: Request, res: Response) => {
  try {
    const filters = req.body;
    const response = await apartmentService.filterApartments(filters);
    res.status(response.status).json(response);
  } catch (error) {
    sendGeneralErrorResponse(res);
    console.error(error);
  }
};

export const updateApartment = async (req: Request, res: Response) => {
  try {
    const apartmentId = Number(req.params.id);
    const data = req.body
    const user = req.body.user
    // to remove user data from object add from auth middleware
    delete data.user
    const response = await apartmentService.updateApartment(apartmentId, data, user.id, user.role);
    res.status(response.status).json(response);
  } catch (error) {
    sendGeneralErrorResponse(res);
    console.error(error);
  }
};

export const deleteApartment = async (req: Request, res: Response) => {
  try {
    const apartmentId = Number(req.params.id);
    const user = req.body.user;
    const response = await apartmentService.deleteApartment(apartmentId, user.id, user.role);
    res.status(response.status).json(response);
  } catch (error) {
    sendGeneralErrorResponse(res);
    console.error(error);
  }
};
