import { ControllerResponse } from ".";
import { FileModel } from "../models";

export type controllerResUploadFile = ControllerResponse<FileModel | null>;

export interface EditProductProps {
    id?: number;
    name?: string;
    description?: string;
    imageId?: number;
    imageUrl?: string;
    quantity?: number;
    available?: boolean;
    price?: number;
}
