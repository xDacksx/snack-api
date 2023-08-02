import { TypedResponse } from "..";
import { ProductModel } from "../models";
import { ServerResponse } from "../server.interface";

export type ResCreateProduct = TypedResponse<
    ServerResponse<ProductModel | null>
>;

export type ResGetProducts = TypedResponse<ServerResponse<ProductModel[]>>;
