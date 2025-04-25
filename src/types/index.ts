import { IEvents } from "../components/base/events";

export interface IProduct {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    image: string;
}

export interface ICardsData {
	cards: IProduct[];
	preview: string | null;
	addCard(card: IProduct): void;
	deleteCard(cardId: string, payload: Function | null): void;
	getCard(cardId: string): IProduct;
	checkValidation(data: Record<keyof TCardInfo, string>): boolean;
}

export type TCardInfo = Pick<IProduct, 'title' | 'image'>;

export interface IBasketModel {
    // items: IBasketItem[];
    items: Map<string, number>;
    add(id: string): void;
    remove(id: string): void;
}

export type IBasketItem = Pick<IProduct, '_id' | 'title' | 'price'>;

export interface IOrderForm {
    email: string;
    phone: string;
    address: string;
    payment: 'Онлайн' | 'При получении';
    checkValidation(data: Record<keyof IOrderForm, string>): boolean;
}

export interface IOrder extends IOrderForm {
    items: string[]
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IView {
    render (data?: object): HTMLElement;
}

export interface IViewConstructor {
    new (container: HTMLElement, events?: IEvents): IView;
}