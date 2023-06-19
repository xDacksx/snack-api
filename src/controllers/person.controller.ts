import { Person as IPerson } from "@prisma/client";
import { primsa } from "./";

export class Person {
    constructor() {}

    public async create(data: IPerson) {
        await primsa.person.create({ data });
    }
}
