import { IBasketItem, IBasketModel, IProduct } from "../types";
import { IEvents } from "./base/events";

export class BasketModel implements IBasketModel {
        protected _items: IBasketItem[];
        protected events: IEvents;
        
        constructor (events: IEvents) {
            this.items = [];
            this.events = events;
        }

        set items(items: IBasketItem[]) {
            this._items = items;
        }

        get items() {
            return this._items;
        }

        add(product: IProduct) {
            this.items.push(product);
            this.events.emit('basket:changed')
        }

        remove(id: string, price: number) {
            this.items = this.items.filter(item => item.id !== id);
            this.events.emit('basket:changed')
        }

        getTotal() {
            let total = 0;
            this._items.forEach((item) => total += item.price);
            return total;
        }

        clearBasket() {
            this.items = [];
        }
}