import { primsa } from ".";
import { Gender as IGender } from "../interfaces/models";

export class Gender {
    constructor() {}

    public async search(name: string): Promise<IGender | null> {
        try {
            return await primsa.gender.findUnique({ where: { name } });
        } catch (error) {
            return null;
        }
    }

    public get male() {
        return this.search("male");
    }

    public get female() {
        return this.search("female");
    }
}
