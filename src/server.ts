import { ServerPort, ServerRoute } from "./interfaces/server.interface";
import { ServerOptions } from "./interfaces/server.interface";
import { SuccessMessage, addresses } from "./utility";
import { ErrorMessage, InfoMessage } from "./utility";
import { AuthRoute } from "./routes/auth.route";
import Express, { Application } from "express";
import FileUpload from "express-fileupload";
import { controller } from "./controllers";
import { IndexRouter } from "./routes";
import colour from "colors";
import cors from "cors";
import { RoleRoute } from "./routes/role.route";

export class Server {
    private server: Application;
    private port: ServerPort;

    private ip = addresses().WiFi[0];

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
        this.server.use(
            cors({
                origin: ["http://localhost:5173", `http://${this.ip}:5173`],
            })
        );
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
            {
                direction: "/auth",
                function: AuthRoute,
            },
            {
                direction: "/role",
                function: RoleRoute,
            },
        ];

        array.forEach((route) =>
            this.server.use(route.direction, route.function)
        );
    }

    public listen(): void {
        this.server.listen(this.port).on("error", this.onError);
        this.message();
        this.setup();
    }

    private onError(error: Error) {
        ErrorMessage(error.message);
    }
    private message() {
        SuccessMessage("Compiled succesfully!\n");
        InfoMessage(`Local:    http://localhost:${this.port}`);

        if (this.ip === "127.0.0.1") return console.log();

        InfoMessage(`Network:  http://${this.ip}:${this.port}\n`);
    }

    private async setup() {
        const connected = await controller.databse.checkConnection();
        if (!connected) return;

        await controller.role.create("admin");
        await controller.role.create("client");
        await controller.role.create("delivery");

        await controller.gender.create("male");
        await controller.gender.create("female");
    }
}
