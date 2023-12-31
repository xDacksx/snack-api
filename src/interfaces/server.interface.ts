import { Router } from "express";

export type ServerPort = number;

export interface ServerOptions {
    port: ServerPort;
}

export interface ServerRoute {
    direction: string;
    function: Router;
}
export interface ServerResponse<T> {
    data: T;
    message: string;
    errors: Array<string>;
}
