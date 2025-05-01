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