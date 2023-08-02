import { UploadedFile } from "express-fileupload";
import { Req, Res } from "../interfaces/middlewares.interface";
import { controller } from "../controllers";
import { Product, ProductModel } from "../interfaces/models";
import { parseBoolean } from "../utility";
import {
    ResCreateProduct,
    ResGetProducts,
} from "../interfaces/middlewares/product";

export const createProduct = async (
    req: Req,
    res: ResCreateProduct
): Promise<ResCreateProduct> => {
    if (!req.files) return res.json();
    const image = req.files.image as UploadedFile;
    const { data } = await controller.file.upload(image);
    if (!data) return res.json();

    const name: string = req.body.name;
    const description: string = req.body.description;
    const price: number = parseFloat(req.body.price);
    const quantity: number = parseInt(req.body.quantity);
    const available: boolean = parseBoolean(req.body.available);

    const product = await controller.product.create({
        name,
        description,
        quantity,
        available,
        price,
        imageId: data.id,
    });

    if (product) {
        return res.send({
            data: product,
            errors: [],
            message: `Product ${product.name} created!`,
        });
    } else {
        return res.send({
            data: product,
            errors: ["Something went wrong!"],
            message: `Something went wrong!`,
        });
    }
};

export const getProducts = async (
    req: Req,
    res: ResGetProducts
): Promise<ResGetProducts> => {
    const products: ProductModel[] = await controller.product.all;

    return res.send({
        message:
            products.length > 0
                ? "Products fetched"
                : "There are currently no registered products",
        data: products,
        errors: [],
    });
};
