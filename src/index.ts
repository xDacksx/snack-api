import { Server } from "./server";

class App {
    constructor() {
        console.clear();
        this.Run();
    }

    private Run() {
        const server = new Server({ port: 5000 });
        server.listen();
    }
}

new App();
