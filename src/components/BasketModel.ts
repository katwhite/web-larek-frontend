import { IBasketItem, IBasketModel, IProduct } from "../types";
import { IEvents } from "./base/events";

export class BasketModel implements IBasketModel {
        items: IBasketItem[];
        protected events: IEvents;
        
        constructor (events: IEvents) {
            this.items = [];
            this.events = events;
        }

        add(product: IProduct) {
            this.items.push(product);
        }

        remove(id: string) {
            this.items = this.items.filter(item => item.id !== id);
        }
}