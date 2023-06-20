import { Person as IPerson } from "../interfaces/models";
import { primsa } from "./";

export class Person {
    constructor() {}

    public async create(data: IPerson): Promise<IPerson | null> {
        try {
            return await primsa.person.create({ data });
        } catch (error) {
            return null;
        }
    }
}
