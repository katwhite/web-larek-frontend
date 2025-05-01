import { IEvents } from "../components/base/events";

export interface IProduct {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    image: string;
}

export interface ICardsData {
	cards: IProduct[];
	preview: string | null;
	getCard(cardId: string): IProduct;
}

export interface IBasketModel {
    items: IBasketItem[];
    add(product: IProduct): void;
    remove(id: string, price: number): void;
    clearBasket(): void;
}

export type IBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;

export interface IOrderForm {
    email: string;
    phone: string;
    address: string;
    payment: string;
}

export interface IOrder extends IOrderForm {
    items: string[],
    total: number
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
    id: string;
    total: number;
}

export type Payment = 'cash' | 'card';
