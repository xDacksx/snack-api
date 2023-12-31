import { ErrorMessage, InfoMessage } from "../utility";
import { RoleModel as IRole } from "../interfaces/models/";
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
    public async searchId(id: number): Promise<IRole | null> {
        try {
            return await prisma.role.findUnique({ where: { id } });
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

    private async getAll() {
        return await prisma.role.findMany();
    }

    public get all() {
        return this.getAll();
    }
}
