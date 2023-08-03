import { UploadedFile } from "express-fileupload";
import { Req, Res } from "../interfaces/middlewares.interface";
import { controller } from "../controllers";
import { Product, ProductModel } from "../interfaces/models";
import { parseBoolean } from "../utility";
import {
    ResCreateProduct,
    ResGetProduct,
    ResGetProductImg,
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
        imageUrl: "",
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

export const getProduct = async (
    req: Req,
    res: ResGetProduct
): Promise<ResGetProduct> => {
    if (!req.params.id) return res.json();

    const product = await controller.product.getProduct(
        parseInt(req.params.id)
    );

    return res.send({
        message: product
            ? "Product found"
            : "This id doesn't belong to any product",
        data: product,
        errors: product ? [] : ["This id doesn't belong to any product"],
    });
};

export const getProductImg = async (
    req: Req,
    res: ResGetProductImg
): Promise<ResGetProductImg | void> => {
    if (!req.params.id) return res.json();

    const product = await controller.product.getProduct(
        parseInt(req.params.id)
    );

    if (!product) {
        return res.send({
            message: "This id doesn't belong to any product",
            data: product,
            errors: ["This id doesn't belong to any product"],
        });
    } else {
        return res.sendFile("C:\\Users\\dacks\\Pictures\\hamburguer.png");
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
