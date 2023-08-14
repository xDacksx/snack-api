export type StoreProduct = {
    princeInCents: number;
    name: string;
};

export interface CartItem {
    id: number;
    quantity: number;
}

export interface addProductProps {
    productId: number;
    email: string;
}
