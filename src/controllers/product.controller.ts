import { prisma } from ".";
import { Product as IProduct, ProductModel } from "../interfaces/models/";
import { ErrorMessage } from "../utility";

export class Product {
    constructor() {}

    public get all() {
        try {
            return prisma.product.findMany();
        } catch (error) {
            if (error instanceof Error) ErrorMessage(error.message);
            return [];
        }
    }

    public async getProduct(id: number): Promise<ProductModel | null> {
        try {
            return await prisma.product.findUnique({ where: { id } });
        } catch (error) {
            if (error instanceof Error) ErrorMessage(error.message);
            return null;
        }
    }

    async create(product: IProduct): Promise<ProductModel | null> {
        try {
            return await prisma.product.create({ data: product });
        } catch (error) {
            if (error instanceof Error) ErrorMessage(error.message);
            return null;
        }
    }
}
