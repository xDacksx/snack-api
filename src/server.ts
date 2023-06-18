import {
    ServerOptions,
    ServerPort,
    ServerRoute,
} from "./interfaces/server.interface";
import Express, { Application, Router } from "express";
import colour from "colors";
import { ErrorMessage, InfoMessage, SuccessMessage } from "./utility";
import { address } from "ip";
import cors from "cors";
import FileUpload from "express-fileupload";
import { IndexRouter } from "./routes/_index";
import { controller } from "./controllers";

export class Server {
    private server: Application;
    private port: ServerPort;

    constructor({ port }: ServerOptions) {
        this.server = Express();
        this.port = port;
        this.settings();
        this.middlewares();
        this.routes();
    }
    private settings(): void {
        colour.enable();
        this.server.set("port", this.port);
    }
    private middlewares(): void {
        this.server.use(cors());
        this.server.use(FileUpload({ createParentPath: true }));
        this.server.use(Express.urlencoded({ extended: true }));
        this.server.use(Express.json());
    }

    private routes(): void {
        const array: ServerRoute[] = [
            {
                direction: "/",
                function: IndexRouter,
            },
        ];

        array.forEach((route) =>
            this.server.use(route.direction, route.function)
        );
    }

    public listen(): void {
        this.server.listen({ port: this.port }).on("error", this.onError);
        this.message();
        this.setup();
    }

    private onError(error: Error) {
        ErrorMessage(error.message);
    }
    private message() {
        SuccessMessage("Compiled succesfully!\n");
        InfoMessage(`Local:    http://localhost:${this.port}`);

        const ip = address();

        if (ip === "127.0.0.1") return console.log();

        InfoMessage(`Network:  http://${ip}:${this.port}\n`);
    }

    private async setup() {
        await controller.role.create("admin");
        await controller.role.create("client");
        await controller.role.create("delivery");
    }
}
