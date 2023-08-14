import Stripe from "stripe";
import { controller, prisma, stripe } from ".";
import {
    CartItem,
    StoreProduct,
    addProductProps,
} from "../interfaces/controllers/cart";
import {
    CartModel,
    ProductModel,
    ProductWithImgModel,
} from "../interfaces/models";
import { ErrorMessage } from "../utility";
import { serverIp } from "../server";

export class Cart {
    constructor() {}

    public async create(email: string): Promise<CartModel | null> {
        try {
            return await prisma.cart.create({ data: { userEmail: email } });
        } catch (error) {
            return null;
        }
    }

    public async get(userEmail: string) {
        try {
            const cart = await prisma.cart.findFirst({ where: { userEmail } });
            if (!cart) throw new Error("This user does not have a cart");

            const response = await prisma.cartProduct.findMany({
                where: { cartId: cart.id },
            });

            const products: ProductWithImgModel[] = [];

            for (let i = 0; i < response.length; i++) {
                const element = response[i];

                const product = await prisma.product.findUnique({
                    where: { id: element.productId },
                });

                if (product) {
                    const img = await controller.product.LinkImg(product.id);
                    if (product && img) products.push(img);
                }
            }

            const cartItems = await this.countProducts(products);

            for (const key in cartItems) {
                const element = cartItems[key];
                const product = await controller.product.getProduct(element.id);
                if (product && product.quantity < element.quantity) {
                    const lasts = await prisma.cartProduct.findMany({
                        where: {
                            AND: [
                                { cartId: cart.id },
                                { productId: element.id },
                            ],
                        },
                        skip: element.quantity - product.quantity,
                    });

                    const ids = lasts.map((p) => p.id);

                    await prisma.cartProduct.deleteMany({
                        where: { id: { in: ids } },
                    });
                }
            }

            return {
                cart,
                data: products,
            };
        } catch (error) {
            console.log(error);
            return {
                cart: null,
                data: [],
            };
        }
    }

    public async addProduct({ productId, email }: addProductProps) {
        try {
            const { cart, data } = await this.get(email);
            if (!cart) throw new Error("This cart does not exist");

            const product = await controller.product.getProduct(productId);
            if (!product) throw new Error("This product does not exist");

            if (!product.available)
                throw new Error("This product is currently unavailable");

            const cartItems = await this.countProducts(data);

            const id: number[] = [];

            for (const key in cartItems) {
                const element = cartItems[key];
                if (element.quantity + 1 > product.quantity)
                    id.push(element.id);
            }

            if (product.quantity < 1 || id.includes(productId))
                throw new Error("This product is out of stock!");

            const success = await prisma.cartProduct.create({
                data: {
                    cartId: cart.id,
                    productId,
                },
            });
            if (!success) throw new Error("Something went wrong");

            return {
                added: true,
                msg: "Added",
            };
        } catch (error) {
            let message = "";
            if (error instanceof Error) {
                message = error.message;
                ErrorMessage(
                    "Couldn't add product",
                    `[${productId}]`,
                    "because it does not exist!"
                );
            }
            return { added: false, msg: message };
        }
    }

    public async deleteProduct({ email, productId }: addProductProps) {
        try {
            const { cart, data } = await this.get(email);
            if (!cart) throw new Error("This cart does not exist");

            const product = await controller.product.getProduct(productId);
            if (!product) throw new Error("This product does not exist");

            const cartProduct = await prisma.cartProduct.findFirst({
                where: {
                    cartId: cart.id,
                    productId,
                },
            });

            if (!cartProduct)
                throw new Error("This product is not in this cart");

            await prisma.cartProduct.delete({ where: { id: cartProduct.id } });
            return {
                deleted: true,
                msg: "Deleted",
            };
        } catch (error) {
            let message = "";
            if (error instanceof Error) {
                message = error.message;
                ErrorMessage(
                    "Couldn't delete product",
                    `[${productId}]`,
                    "because it does not exist!"
                );
            }
            return { deleted: false, msg: message };
        }
    }

    public async buy(email: string) {
        try {
            const StoreProducts: Map<number, StoreProduct> = new Map();
            const products = await controller.product.getAll();

            for (let i = 0; i < products.length; i++) {
                const element = products[i];
                StoreProducts.set(element.id || 0, {
                    name: element.name,
                    princeInCents: element.price * 100,
                });
            }

            const { data: userCart } = await this.get(email);

            const CartItems = await this.countProducts(userCart);

            if (CartItems.length < 1) throw new Error("Cart is empty!");

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card", "oxxo"],
                mode: "payment",
                line_items: CartItems.map((item) => {
                    const storeItem = StoreProducts.get(item.id);

                    return {
                        price_data: {
                            currency: "mxn",
                            product_data: {
                                name: storeItem?.name || "tal vez",
                            },
                            unit_amount: storeItem?.princeInCents,
                        },
                        quantity: item.quantity,
                    };
                }),
                success_url: `https://${serverIp}:5000/user/cart/success`,
                // cancel_url: `https://${serverIp}:5000/user/cart/failure`,
            });

            return {
                data: {
                    url: session.url,
                    success: session.success_url,
                    failure: session.cancel_url,
                    total: session.amount_total,
                },
                errors: [],
            };
        } catch (error) {
            let message = "";
            if (error instanceof Error) {
                message = error.message;
                ErrorMessage("Couldn't buy the cart because it's empty");
            }

            return {
                data: null,
                errors: [message],
            };
        }
    }

    private async countProducts(userCart: ProductModel[]) {
        const CartItems: CartItem[] = [];
        const itemCount: { [key: number]: number } = {};

        for (let i = 0; i < userCart.length; i++) {
            const element = userCart[i];

            if (element.available && element.quantity > 0) {
                const productId = element.id || 0;
                itemCount[productId] = (itemCount[productId] || 0) + 1;
            }
        }

        for (const key in itemCount) {
            let quantity = itemCount[key];
            const id = parseInt(key);

            const product = await controller.product.getProduct(id);

            // if (product && product.quantity < quantity) {
            //     quantity = product.quantity;
            // }

            const CartItem = { id, quantity };

            CartItems.push(CartItem);
        }

        return CartItems;
    }
}
