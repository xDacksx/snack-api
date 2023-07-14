import { ErrorMessage, InfoMessage } from "../utility";
import { Role as IRole } from "../interfaces/models/";
import { prisma } from ".";

export class Role {
    constructor() {}

    public async search(name: string): Promise<IRole | null> {
        try {
            return await prisma.role.findUnique({ where: { name } });
        } catch (error) {
            return null;
        }
    }
    public async create(name: string): Promise<IRole | null> {
        try {
            const role = await this.search(name);
            if (role) return role;
            else {
                const role = await prisma.role.create({ data: { name } });
                InfoMessage("Role", name, "has been created!");
                return role;
            }
        } catch (error) {
            if (error instanceof Error) ErrorMessage(error.message);
            return null;
        }
    }

    public get client() {
        return this.search("client");
    }
    public get admin() {
        return this.search("admin");
    }
    public get delivery() {
        return this.search("delivery");
    }
}
