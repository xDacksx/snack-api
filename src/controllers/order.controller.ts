import { controller, prisma, stripe } from ".";
import {
    createOrderProps,
    setStateProps,
} from "../interfaces/controllers/order";
import { OrderModel, UserModel } from "../interfaces/models";
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

            const total = products
                .map((product) => product.price)
                .reduce((a, b) => a + b);

            const order = await prisma.order.create({
                data: {
                    userEmail: email,
                    deliveryEmail: deliverer.email,
                    url,
                    secret,
                    total,
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

    public async get(id: string) {
        try {
            const order = await prisma.order.findUnique({ where: { id } });
            if (!order) throw new Error();

            const status = await prisma.orderStatus.findFirst({
                where: { orderId: order.id },
            });
            if (!status) throw new Error();

            const items = await prisma.orderProduct.findMany({
                where: { orderId: order.id },
            });

            return {
                id: order.id,
                delivered: status.delivered,
                paid: status.paid,
                location: status.location,
                total: order.total,
                date: order.createdAt,
                url: status.paid ? "" : order.url,
                products: items.map((product) => {
                    return {
                        id: product.productId,
                        quantity: product.quantity,
                    };
                }),
            };
        } catch (error) {
            return null;
        }
    }

    public async getAll(email: string) {
        try {
            const orders: OrderModel[] = await prisma.order.findMany({
                where: { userEmail: email },
            });

            const Orders = [];

            for await (const order of orders) {
                Orders.push(await this.get(order.id));
            }

            return Orders;
        } catch (error) {
            return [];
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

    public async setState({ id, delivered, paid }: setStateProps) {
        try {
            const current = await this.get(id);
            const status = await prisma.orderStatus.findFirst({
                where: { orderId: id },
            });
            if (!current || !status) throw new Error();

            if (delivered === undefined) delivered = current.delivered;
            if (paid === undefined) paid = current.paid;

            await prisma.orderStatus.update({
                where: { id: status.id },
                data: {
                    delivered,
                    paid,
                },
            });

            return await this.get(id);
        } catch (error) {}
    }
}
