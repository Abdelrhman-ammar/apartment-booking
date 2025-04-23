import prisma from "../prisma/client";
import User, { UserParams } from "../models/user";
import { hashPassword } from "../utils/hash.js";
import { generateResponse } from "../utils/response";
import { statusCodes } from "../utils/status-responses";

export class UserService {
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
    userData.password = await hashPassword(userData.password);
    const created = await prisma.user.create({ data: userData });
    return new User(created);
  }
}
