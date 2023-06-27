import { primsa } from ".";
import { Gender as IGender } from "../interfaces/models";
import { ErrorMessage, InfoMessage } from "../utility";

export class Gender {
    constructor() {}

    public async search(name: string): Promise<IGender | null> {
        try {
            return await primsa.gender.findUnique({ where: { name } });
        } catch (error) {
            return null;
        }
    }

    public async create(name: string): Promise<IGender | null> {
        try {
            const gender = await this.search(name);
            if (gender) return gender;
            else {
                const gender = await primsa.gender.create({ data: { name } });
                InfoMessage("Gender", name, "has been created!");
                return gender;
            }
        } catch (error) {
            if (error instanceof Error) ErrorMessage(error.message);
            return null;
        }
    }
    private async getAll() {
        return await primsa.gender.findMany();
    }

    public get all() {
        return this.getAll();
    }

    public get male() {
        return this.search("male");
    }

    public get female() {
        return this.search("female");
    }
}
