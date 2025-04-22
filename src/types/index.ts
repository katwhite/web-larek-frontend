import { IEvents } from "../components/base/events";

export interface ICard {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    image: string;
    added: boolean; 
}

export interface ICardsData {
    cards: ICard[];
    preview: string | null;
    addCard(card: ICard): void;
    getCard(cardId: string): ICard;
}

export interface IBasketModel {
    // items: IBasketItem[];
    items: Map<string, number>;
    add(id: string): void;
    remove(id: string): void;
}

export type IBasketItem = Pick<ICard, '_id' | 'title' | 'price'>;

export interface IOrderForm {
    email: string;
    phone: string;
    address: string;
    payment: 'Онлайн' | 'При получении';
    checkValidation(data: Record<keyof IOrderForm, string>): boolean;
}

export interface IOrderResult {
    price: number;
}

export interface IView {
    render (data?: object): HTMLElement;
}

export interface IViewConstructor {
    new (container: HTMLElement, events?: IEvents): IView;
}