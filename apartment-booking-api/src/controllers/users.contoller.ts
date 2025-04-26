import { Request, Response } from 'express';
import { UserService } from "../services/user.service";
import { generateToken } from '../utils/jwt';
import { comparePassword } from '../utils/hash'
import { generateResponse, sendGeneralErrorResponse } from "../utils/response";
import { statusCodes } from "../utils/status-responses";
import { ValidationObject } from "../types/validation-object";
import { Prisma } from "@prisma/client";

const userService = new UserService();
const generalErrorHint = 'Apartment';

export const register = async (req: Request, res: Response) => {
    try {
      const userData = req.body
      const validationObject: ValidationObject = UserService.validate(userData);
      let response = validationObject.response;
      if (validationObject.valid) {
        response = await userService.createUser(userData);
      }
      res.status(response?.status || 500).json(response);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target;
          const field = (Array.isArray(target) ? target[0] : null) || 'field';
          const response = generateResponse({
            status: statusCodes.BAD_REQUEST,
            error: `A user with this ${field} already exists.`
          });
          res.status(response.status).json(response);
          return;
        }
      }
      sendGeneralErrorResponse(res, generalErrorHint);
      console.error(error);
    }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const response = await userService.getUserById(userId);
    res.status(response.status).json(response);
  } catch (error) {
    sendGeneralErrorResponse(res, generalErrorHint)
    console.error(error)
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const user = await userService.getUserObjectByEmail(email)
    if (!user || !user.password || !(await comparePassword(password, user.password))) {
      const response = generateResponse({status: statusCodes.NOT_FOUND, error: 'Invalid credentials'})
      res.status(response.status).json(response);
      return;
    }
    const token = generateToken(user.serializedObject());
    const response = generateResponse({status: statusCodes.CREATED, data: {token}})
    res.status(response.status).json(response);
  } catch (error) {
    sendGeneralErrorResponse(res, generalErrorHint)
    console.error(error)
  }
};
