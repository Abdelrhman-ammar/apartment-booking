import { Request, Response } from 'express';
import { UserService } from "../services/user.service";
import { generateToken } from '../utils/jwt';
import { comparePassword } from '../utils/hash'
import { generateResponse, sendGeneralErrorResponse } from "../utils/response";
import { statusCodes } from "../utils/status-responses";

export const register = async (req: Request, res: Response) => {
  const userService = new UserService();
    try {
      const response = await userService.createUser(req.body);
      res.status(response.status).json(response);
    } catch (error) {
      sendGeneralErrorResponse(res)
      console.error(error)
    }
};

export const getUser = async (req: Request, res: Response) => {
  const userService = new UserService();
  try {
    const userId = Number(req.params.id);
    const response = await userService.getUserById(userId);
    res.status(response.status).json(response);
  } catch (error) {
    sendGeneralErrorResponse(res)
    console.error(error)
  }
};

export const login = async (req: Request, res: Response) => {
  const userService = new UserService();
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
    sendGeneralErrorResponse(res)
    console.error(error)
  }
};