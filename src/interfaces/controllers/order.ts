import { ProductModel } from "../models";

export interface createOrderProps {
    email: string;
    url: string;
    location: string;
    products: ProductModel[];
    secret: string;
}
