import { Role as IRole } from "../interfaces/models/role";
import { primsa } from ".";

export class Role {
    constructor() {}

    public async search(name: string): Promise<IRole | null> {
        try {
            return await primsa.role.findUnique({ where: { name } });
        } catch (error) {
            return null;
        }
    }
    public async create(name: string) {
        try {
            const role = await primsa.role.create({ data: { name } });
        } catch (error) {}
    }
}
