import { throws } from "assert";
import { prisma } from ".";
import { EditProductProps } from "../interfaces/controllers/product";
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

    async edit(
        product: EditProductProps,
        id: number
    ): Promise<ProductModel | null> {
        try {
            const current = await this.getProduct(id);
            if (!current) throw new Error("This Product does not exits!");

            if (!product.available) product.available = current.available;
            if (!product.description) product.description = current.description;
            if (!product.id) product.id = current.id;
            if (!product.imageId) product.imageId = current.imageId;
            if (!product.imageUrl) product.imageUrl = current.imageUrl;
            if (!product.name) product.name = current.name;
            if (!product.price) product.price = current.price;
            if (!product.quantity) product.quantity = current.quantity;

            return await prisma.product.update({
                where: { id },
                data: product,
            });
        } catch (error) {
            if (error instanceof Error) ErrorMessage(error.message);
            return null;
        }
    }
}
