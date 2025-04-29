import {formatNumber} from "../utils/utils";
import { IEvents } from "./base/events";
import {IProduct, ICardsData, IOrder, FormErrors, IOrderForm} from "../types";

export class CardsData implements ICardsData {
    protected _cards: IProduct[];
    protected _preview: string | null;
    protected events: IEvents;

    constructor (events: IEvents) {
        this.events = events;
    }
    
    set cards(cards: IProduct[]) {
        this._cards = cards;
        this.events.emit('initialData:loaded');
    };

    get cards() {
        return this._cards;
    };

    getCard(cardId: string) {
        return this._cards.find((item) => item.id === cardId)
    }

    set preview(cardId: string | null) {
        if (!cardId) {
            this._preview = null;
            return;
        }
        const selectedCard = this.getCard(cardId);
        if (selectedCard) {
            this._preview = cardId;
            this.events.emit('card:selected')
        }
    }

    get preview () {
        return this._preview;
    }
}

export class AppState<T> {
    loading: boolean;
    order: IOrder = {
        email: '',
        phone: '',
        address: '',
        payment: '',
        items: []
    };
    formErrors: FormErrors = {};

    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }

    // setOrderField(field: keyof IOrderForm, value: string) {
    //     this.order[field] = value;

    //     if (this.validateOrder()) {
    //         this.events.emit('order:ready', this.order);
    //     }
    // }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}