import { UploadedFile } from "express-fileupload";
import { FileModel } from "../interfaces/models/";
import { resolve } from "path";
import { ErrorMessage, getDateAsText } from "../utility";
import { controllerResUploadFile } from "../interfaces/controllers/product";
import { existsSync } from "fs";
import { prisma } from ".";

export class File {
    constructor() {}
    private storageRoot = resolve("S:\\SnackStorage");
    private imagesPath = this.storageRoot + "\\images\\";

    public async upload(file: UploadedFile): Promise<controllerResUploadFile> {
        try {
            const filename = getDateAsText() + "_" + file.name;
            const path = this.imagesPath + filename;
            await file.mv(path);
            const uploaded = this.checkFile(path);
            if (!uploaded) throw new Error("File has not been uploaded!");

            const fileUploaded = await prisma.file.create({
                data: {
                    path,
                    url: "",
                },
            });

            return {
                message: "File has been uploaded!",
                data: fileUploaded,
            };
        } catch (error) {
            let message = "Something went wrong!";
            if (error instanceof Error) {
                ErrorMessage(error.message);
                message = error.message;
            }
            return {
                data: null,
                message,
            };
        }
    }

    private checkFile(path: string) {
        return existsSync(path);
    }
}
