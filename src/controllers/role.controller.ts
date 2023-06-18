import { Role as IRole } from "../interfaces/models/role";
import { primsa } from ".";
import { ErrorMessage, InfoMessage } from "../utility";

export class Role {
    constructor() {}

    public async search(name: string): Promise<IRole | null> {
        try {
            return await primsa.role.findUnique({ where: { name } });
        } catch (error) {
            return null;
        }
    }
    public async create(name: string): Promise<IRole | null> {
        try {
            const role = await this.search(name);
            if (role) return role;
            else {
                InfoMessage("Role", name, "has been created!");
                return await primsa.role.create({ data: { name } });
            }
        } catch (error) {
            if (error instanceof Error) ErrorMessage(error.message);
            return null;
        }
    }
}
