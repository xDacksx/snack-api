import { throws } from "assert";
import { controller, prisma } from ".";
import { EditProductProps } from "../interfaces/controllers/product";
import { Product as IProduct, ProductModel } from "../interfaces/models/";
import { ErrorMessage } from "../utility";

export class Product {
    constructor() {}

    private async LinkImg(id: number) {
        try {
            const product = await this.getProduct(id);
            if (!product) throw new Error("");

            const image = await controller.file.getFile(product.imageId);
            if (!image) throw new Error("");

            return {
                ...product,
                imageUrl: image.url,
            };
        } catch (error) {
            console.log(error);
        }
    }

    public async getAll() {
        try {
            const products = await prisma.product.findMany();

            const productWithImg: any[] = [];

            for (let i = 0; i < products.length; i++) {
                const product = products[i];

                productWithImg.push(await this.LinkImg(product.id));
            }

            return productWithImg;
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
            let available = current.available;

            if (product.available === "true") available = true;
            if (product.available === "false") available = false;
            if (product.available === undefined) available = current.available;
            if (!product.description) product.description = current.description;
            if (!product.id) product.id = current.id;
            if (!product.imageId) product.imageId = current.imageId;
            if (!product.name) product.name = current.name;
            if (!product.price) product.price = current.price;

            if (product.quantity === undefined)
                product.quantity = current.quantity;

            return await prisma.product.update({
                where: { id },
                data: {
                    ...product,
                    available,
                },
            });
        } catch (error) {
            if (error instanceof Error) ErrorMessage(error.message);
            return null;
        }
    }
}
