import { IBasketItem, IBasketModel, IProduct } from "../types";
import { IEvents } from "./base/events";

export class BasketModel implements IBasketModel {
        items: IBasketItem[];
        protected _total: number;
        protected events: IEvents;
        
        constructor (events: IEvents) {
            this.items = [];
            this.total = 0;
            this.events = events;
        }

        set total(number:number) {
            this._total = number;
        }

        add(product: IProduct) {
            this.items.push(product);
            this.total += product.price;
        }

        remove(id: string, price: number) {
            this.items = this.items.filter(item => item.id !== id);
            this.total -= price;
        }

        get total() {
            return this._total;
        }
}