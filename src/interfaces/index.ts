import { Response } from "express";

export type TypedResponse<T> = Omit<Response, "send"> & {
    send(data: T): Response;
};
