import { ProductModel } from "../models";

export interface createOrderProps {
    email: string;
    url: string;
    location: string;
    products: ProductModel[];
    secret: string;
}

export interface setStateProps {
    id: string;
    paid?: boolean;
    delivered?: boolean;
}
