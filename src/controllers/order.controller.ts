import { controller, prisma } from ".";
import { createOrderProps } from "../interfaces/controllers/order";
import { UserModel } from "../interfaces/models";
import { randomFrom } from "../utility";

export class Order {
    constructor() {}

    public async create({
        email,
        location,
        products,
        url,
        secret,
    }: createOrderProps) {
        try {
            const deliverers = await controller.user.getAllDeliverers();
            if (deliverers.length < 1)
                throw new Error("There are no deliverers!");

            const deliverer: UserModel = randomFrom(deliverers);

            const order = await prisma.order.create({
                data: {
                    userEmail: email,
                    deliveryEmail: deliverer.email,
                    url,
                    secret,
                },
            });

            const status = await prisma.orderStatus.create({
                data: {
                    location,
                    delivered: false,
                    paid: false,
                    orderId: order.id,
                },
            });

            const items = await controller.cart.countProducts(products);

            for await (const { id, quantity } of items) {
                await prisma.orderProduct.create({
                    data: { quantity, productId: id, orderId: order.id },
                });

                const product = await prisma.product.findFirst({
                    where: { id },
                });

                if (product) {
                    await prisma.product.update({
                        where: { id },
                        data: {
                            quantity: product.quantity - quantity,
                        },
                    });
                }
            }

            await controller.cart.empty(email);

            return {
                data: {
                    id: order.id,
                    delivered: status.delivered,
                    paid: status.paid,
                    location: status.location,
                    products,
                },
                errors: [],
            };
        } catch (error) {
            console.log(error);
            return {
                data: undefined,
                errors: ["si"],
            };
        }
    }

    public async setUrl(url: string, id: string) {
        try {
            await prisma.order.update({
                where: { id },
                data: {
                    url,
                },
            });
        } catch (error) {}
    }
}
