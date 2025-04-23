import prisma from "../prisma/client.js";
import User from "../models/user.js";
import { hashPassword } from "../utils/hash.js";
import { generateResponse } from "../utils/response.js";
import { statusCodes } from "../utils/status-responses.js";

export class UserService {
    async getAllUsers() {
        const users = await prisma.user.findMany();
        return users.map((user) => new User(user));
    }

    async getUserById(id) {
        if (isNaN(id)) {
            return generateResponse({
                status: statusCodes.BAD_REQUEST,
                message: 'ID must be a number'
            });
        }
        let user = await prisma.user.findUnique({ where: { id } });
        const status = user ? statusCodes.OK : statusCodes.NOT_FOUND;
        user = user? new User(user) : null; 
        return generateResponse({ status, data: user.serializedObject() });
    }

    async createUser(user) {
        user.password = await hashPassword(user.password);
        let createdUser = await prisma.user.create({ data: user });
        createdUser = new User(createdUser);
        return generateResponse({ status: statusCodes.CREATED, data: createdUser.serializedObject() });
    }
}