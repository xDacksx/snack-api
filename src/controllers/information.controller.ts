import { controller, prisma } from ".";
import {
    Information as IInformation,
    InformationModel,
} from "../interfaces/models";
export class Information {
    constructor() {}

    private contact = [
        { name: "whatsapp", id: 10, value: "https://www.whatsapp.com" },
        { name: "facebook", id: 11, value: "https://www.facebook.com" },
        { name: "instagram", id: 12, value: "https://www.instagram.com" },
        { name: "x", id: 13, value: "https://www.x.com" },
        { name: "latX", id: 14, value: "0" },
        { name: "latY", id: 15, value: "0" },
    ];

    public async create(data: IInformation): Promise<InformationModel | null> {
        try {
            return await prisma.information.create({ data });
        } catch (error) {
            return null;
        }
    }
    public async search(id: number): Promise<InformationModel | null> {
        try {
            return await prisma.information.findFirst({ where: { id } });
        } catch (error) {
            return null;
        }
    }
    public async edit(data: IInformation): Promise<InformationModel | null> {
        try {
            return await prisma.information.update({
                where: { id: data.id },
                data,
            });
        } catch (error) {
            return null;
        }
    }
    public async destroy(id: number): Promise<InformationModel | null> {
        try {
            const item = this.search(id);
            if (!item) throw new Error(`Information ${id} does not exist`);

            await prisma.information.delete({ where: { id } });

            return item;
        } catch (error) {
            return null;
        }
    }

    public async createContactInfo() {
        for (let i = 0; i < this.contact.length; i++) {
            const { id, name, value } = this.contact[i];
            const item = await this.search(id);
            if (!item) await this.create({ id, name, value });
        }
    }

    public async getContactInfo() {
        this.createContactInfo();
        const items: InformationModel[] = [];

        for (let i = 0; i < this.contact.length; i++) {
            const item = await this.search(this.contact[i].id);
            if (item) items.push(item);
        }

        const info: ContactInformation = {
            whatsapp: items[0].value,
            facebook: items[1].value,
            instagram: items[2].value,
            x: items[3].value,
            latX: parseFloat(items[4].value),
            latY: parseFloat(items[5].value),
        };

        return info;
    }

    public async editContactInfo(data: ContactInformation) {
        for (const name in data) {
            const value = data[name as keyof ContactInformation];
            for (let i = 0; i < this.contact.length; i++) {
                const item = this.contact[i];
                if (name === item.name) {
                    await this.edit({
                        id: item.id,
                        name,
                        value: value.toString(),
                    });
                }
            }
        }

        return {
            message: "Information updated!",
            errors: [],
        };
    }
}

interface ContactInformation {
    whatsapp: string;
    facebook: string;
    instagram: string;
    x: string;
    latX: number;
    latY: number;
}
