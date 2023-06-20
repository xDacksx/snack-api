import { Person as IPerson } from "../interfaces/models";
import { primsa } from "./";

export class Person {
    constructor() {}

    public async create(data: IPerson) {
        await primsa.person.create({ data });
    }
}
