import { PrismaClient } from "@prisma/client";
import { Gender } from "./gender.controller";
import { Role } from "./role.controller";
import { Database } from "./database.controller";

export const primsa = new PrismaClient();

export class ControllerClient {
    constructor() {}

    get gender(): Gender {
        return new Gender();
    }

    get role(): Role {
        return new Role();
    }

    get databse(): Database {
        return new Database();
    }
}

export const controller = new ControllerClient();
