import { UploadedFile } from "express-fileupload";
import { Req } from "../interfaces/middlewares.interface";
import { controller, prisma } from "../controllers";
import { ProductModel } from "../interfaces/models";
import { addresses, parseBoolean } from "../utility";
import {
    ResCreateProduct,
    ResGetProduct,
    ResGetProductImg,
    ResGetProducts,
} from "../interfaces/middlewares/product";
import { serverAdress } from "../server";

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
        await controller.file.editUrl(
            data.id,
            `${serverAdress}/product/${product.id}/img`
        );

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

export const editProduct = async (
    req: Req,
    res: ResCreateProduct
): Promise<ResCreateProduct> => {
    let imageId: number | undefined = undefined;
    const id: number = parseInt(req.params.id);

    if (req.files) {
        const image = req.files.image as UploadedFile;
        const { data } = await controller.file.upload(
            image,
            `${serverAdress}/product/${id}/img`
        );
        if (data) imageId = data.id;
    }

    const name: string = req.body.name;
    const description: string = req.body.description;
    const price: number = parseFloat(req.body.price);
    const quantity: number = parseInt(req.body.quantity);
    const available: "true" | "false" | undefined = req.body.available;

    const product = await controller.product.edit(
        {
            name,
            description,
            quantity,
            available,
            price,
            imageId,
        },
        id
    );

    if (product) {
        return res.send({
            data: product,
            errors: [],
            message: `Product ${product.name} edited!`,
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
        const image = await controller.file.getFile(product.imageId);

        if (!image)
            return res.sendFile("C:\\Users\\dacks\\Pictures\\hamburguer.png");
        return res.sendFile(image.path);
    }
};
export const getProducts = async (
    req: Req,
    res: ResGetProducts
): Promise<ResGetProducts> => {
    const products: ProductModel[] = await controller.product.getAll();

    return res.send({
        message:
            products.length > 0
                ? "Products fetched"
                : "There are currently no registered products",
        data: products,
        errors: [],
    });
};
