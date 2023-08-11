import { UploadedFile } from "express-fileupload";
import { Directory, FileModel } from "../interfaces/models/";
import { resolve } from "path";
import { ErrorMessage, getDateAsText } from "../utility";
import { controllerResUploadFile } from "../interfaces/controllers/product";
import { existsSync } from "fs";
import { prisma } from ".";
import { readdir } from "fs/promises";

export class File {
    constructor() {}
    private storageRoot = resolve("S:\\SnackStorage");
    private imagesPath = this.storageRoot + "\\images\\";

    public async upload(
        file: UploadedFile,
        url?: string
    ): Promise<controllerResUploadFile> {
        try {
            const filename = getDateAsText() + "_" + file.name;
            const path = this.imagesPath + filename;
            await file.mv(path);
            const uploaded = this.checkFile(path);
            if (!uploaded) throw new Error("File has not been uploaded!");

            const fileUploaded = await prisma.file.create({
                data: {
                    path,
                    url: url ?? "",
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

    public async editUrl(
        id: number,
        url: string
    ): Promise<controllerResUploadFile> {
        try {
            const fileEdited = await prisma.file.update({
                where: { id },
                data: { url },
            });

            return {
                message: "File url updated!",
                data: fileEdited,
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

    public async getDirContent(path: string): Promise<Directory[]> {
        const DirContent: Directory[] = [];
        try {
            if (!this.checkFile(path))
                throw new Error(`Path "${path}" not found!`);

            const folder = await readdir(path, { withFileTypes: true });

            folder.forEach((item) => {
                const Directory: Directory = {
                    name: item.name,
                    path: resolve(`${path}\\${item.name}`),
                    type: item.isDirectory() ? "folder" : "file",
                };
                DirContent.push(Directory);
            });

            return DirContent;
        } catch (error) {
            if (error instanceof Error) ErrorMessage(error.message);
            return [];
        }
    }

    public async getFile(id: number): Promise<FileModel | null> {
        try {
            const file = await prisma.file.findUnique({ where: { id } });
            return file;
        } catch (error) {
            if (error instanceof Error) ErrorMessage(error.message);
            return null;
        }
    }

    private checkFile(path: string) {
        return existsSync(path);
    }
}
