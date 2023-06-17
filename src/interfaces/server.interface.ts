import { Router } from "express";

export type ServerPort = number;

export interface ServerOptions {
    port: ServerPort;
}

export interface ServerRoute {
    direction: string;
    function: Router;
}
