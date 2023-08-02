import { prisma } from ".";
import { Product as IProduct, ProductModel } from "../interfaces/models/";
import { ErrorMessage } from "../utility";

export class Product {
    constructor() {}

    async create(product: IProduct): Promise<ProductModel | null> {
        try {
            return await prisma.product.create({ data: product });
        } catch (error) {
            if (error instanceof Error) ErrorMessage(error.message);
            return null;
        }
    }
}
