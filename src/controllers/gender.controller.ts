import { primsa } from ".";
import { Gender as IGender } from "../interfaces/models/gender";

export class Gender {
    constructor() {}

    private async Search(name: string): Promise<IGender | null> {
        try {
            return await primsa.gender.findUnique({ where: { name } });
        } catch (error) {
            return null;
        }
    }

    public get Male() {
        return this.Search("male");
    }

    public get Female() {
        return this.Search("female");
    }
}
