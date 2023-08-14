import { Database } from "./database.controller";
import { PrismaClient } from "@prisma/client";
import { Gender } from "./gender.controller";
import { Role } from "./role.controller";
import { Auth } from "./auth.controller";
import { File } from "./file.controller";
import { Product } from "./product.controller";
import { User } from "./user.controller";
import { Information } from "./information.controller";
import { Cart } from "./cart.controller";
import Stripe from "stripe";

export const prisma = new PrismaClient();
export const stripe = new Stripe(process.env.STRIPE_TESTKEY || "", {
    apiVersion: "2022-11-15",
});

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

    get cart(): Cart {
        return new Cart();
    }

    public async updateUrls(ip: string) {
        const files = await prisma.file.findMany();

        for await (const file of files) {
            const currentUrl = file.url;
            const path = currentUrl.split(":5000/")[1];
            const newUrl = `http://${ip}:5000/${path}`;

            if (!currentUrl.includes(ip)) {
                await controller.file.editUrl(file.id, newUrl);
            }
        }
    }
}

export const controller = new ControllerClient();
