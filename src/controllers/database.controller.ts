import { ErrorMessage, SuccessMessage } from "../utility";
import { prisma } from ".";

export class Database {
    constructor() {}
    public async checkConnection(): Promise<boolean> {
        try {
            await prisma.$queryRaw`SELECT 1+1`;
            SuccessMessage("Database", "snack", "succesfully connected!");
            return true;
        } catch (error) {
            if (error instanceof Error) ErrorMessage(error.message);
            return false;
        }
    }
}
