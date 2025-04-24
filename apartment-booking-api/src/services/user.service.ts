import prisma from "../prisma/client";
import User, { UserParams } from "../models/user";
import { hashPassword } from "../utils/hash.js";
import { generateResponse, ResponseObject } from "../utils/response";
import { statusCodes } from "../utils/status-responses";
import {ValidationObject} from "../types/validation-object";

export class UserService {
  static validate(userData: UserParams): ValidationObject {
    const error = User.validate(userData);
    return {
      valid: !error,
      response: error? generateResponse({status: statusCodes.BAD_REQUEST, error}) : null
    };
  }

  async getAllUsers() {
    const users = await this.getAllUserObjects();
    return generateResponse({
      status: statusCodes.OK,
      data: users.map((u: User) => u.serializedObject()),
    });
  }

  async getUserById(id: number) {
    if (isNaN(id)) {
      return generateResponse({
        status: statusCodes.BAD_REQUEST,
        message: "ID must be a number",
      });
    }

    const user = await this.getUserObjectById(id);
    const status = user ? statusCodes.OK : statusCodes.NOT_FOUND;

    return generateResponse({
      status,
      data: user?.serializedObject() ?? null,
    });
  }

  async getUserByEmail(email: string) {
    const user = await this.getUserObjectByEmail(email);
    const status = user ? statusCodes.OK : statusCodes.NOT_FOUND;

    return generateResponse({
      status,
      data: user?.serializedObject() ?? null,
    });
  }

  async createUser(userData: UserParams) {
    const user = await this.createUserObject(userData);
    return generateResponse({
      status: statusCodes.CREATED,
      data: user?.serializedObject(),
    });
  }


  async getAllUserObjects() {
    const users = await prisma.user.findMany();
    return users.map((user: UserParams) => new User(user));
  }

  async getUserObjectById(id: number) {
    if (isNaN(id)) return null;
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? new User(user) : null;
  }

  async getUserObjectByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? new User(user) : null;
  }

  async createUserObject(userData: UserParams) {
    if(!userData.password) { return null}
    const password = await hashPassword(userData.password);
    userData.password = password
    const userInput = { ...userData, password };
    const created = await prisma.user.create({ data: userInput });
    return new User(created);
  }
}
