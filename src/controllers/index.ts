import { PrismaClient } from "@prisma/client";
import { Gender } from "./gender.controller";
import { Role } from "./role.controller";

export const primsa = new PrismaClient();

export class ControllerClient {
    constructor() {}

    get gender(): Gender {
        return new Gender();
    }

    get role(): Role {
        return new Role();
    }
}

export const controller = new ControllerClient();
