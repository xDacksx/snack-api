import { ServerPort, ServerRoute } from "./interfaces/server.interface";
import { ServerOptions } from "./interfaces/server.interface";
import { SuccessMessage, addresses, ips } from "./utility";
import { ErrorMessage, InfoMessage } from "./utility";
import { AuthRoute } from "./routes/auth.route";
import Express, { Application } from "express";
import FileUpload from "express-fileupload";
import { controller } from "./controllers";
import { IndexRouter } from "./routes";
import colour from "colors";
import cors from "cors";
import { RoleRoute } from "./routes/role.route";
import { GenderRoute } from "./routes/gender.route";
import { ProductRoute } from "./routes/product.route";
import { config } from "dotenv";
import { UserRoute } from "./routes/user.route";

export const serverIp = "192.168.2.50";

export class Server {
    private server: Application;
    private port: ServerPort;

    private ips = ips();

    private ip = serverIp;

    constructor({ port }: ServerOptions) {
        this.server = Express();
        this.port = port;
        this.settings();
        this.middlewares();
        this.routes();
    }
    private settings(): void {
        config();
        colour.enable();
        this.server.set("port", this.port);
    }
    private middlewares(): void {
        const ports = this.ips.map((ip) => `http://${ip}:4321`);

        this.server.use(
            cors({
                origin: [
                    "http://localhost:4321",
                    `http://${this.ip}:4321`,
                    `http://${this.ip}:1234`,
                ],
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
            {
                direction: "/gender",
                function: GenderRoute,
            },
            {
                direction: "/product",
                function: ProductRoute,
            },
            {
                direction: "/user",
                function: UserRoute,
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

        // const networks = addresses();

        // for (const item in networks) {
        //     const name = item;
        //     const ip = networks[item][0];
        //     InfoMessage(`${name}:  http://${ip}:${this.port}`);
        // }

        InfoMessage(`WiFi:  http://${this.ip}:${this.port}`);
        console.log();
    }

    private async setup() {
        const connected = await controller.databse.checkConnection();
        if (!connected) return;

        // console.log(await controller.cart.get("diegozar02@gmail.com"));
        console.log(
            await controller.cart.addProduct({
                email: "diegozar02@gmail.com",
                productId: 52,
            })
        );

        // await controller.cart.buy("diegozar02@gmail.com");

        await controller.role.create("admin");
        await controller.role.create("client");
        await controller.role.create("delivery");

        await controller.gender.create("male");
        await controller.gender.create("female");

        await controller.information.createContactInfo();
    }
}
