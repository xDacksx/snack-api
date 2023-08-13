import { Database } from "./database.controller";
import { PrismaClient } from "@prisma/client";
import { Gender } from "./gender.controller";
import { Role } from "./role.controller";
import { Auth } from "./auth.controller";
import { File } from "./file.controller";
import { Product } from "./product.controller";
import { User } from "./user.controller";
import { Information } from "./information.controller";

export const prisma = new PrismaClient();

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

    get auth(): Auth {
        return new Auth();
    }

    get file(): File {
        return new File();
    }

    get product(): Product {
        return new Product();
    }

    get user(): User {
        return new User();
    }

    get information(): Information {
        return new Information();
    }
}

export const controller = new ControllerClient();
