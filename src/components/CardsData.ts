import {formatNumber} from "../utils/utils";
import { IEvents } from "./base/events";
import {IProduct, ICardsData, TCardInfo} from "../types";

// export type CatalogChangeEvent = {
//     catalog: ProductItem[];
// };

// export class ProductItem implements IProduct {
//     description: string;
//     protected _id: string;
//     image: string;
//     title: string;
//     price: number;
//     category: string;
// }

export class CardData implements ICardsData {
    protected _cards: IProduct[];
    protected _preview: string | null;
    protected events: IEvents;

    constructor (events: IEvents) {
        this.events = events;
    }
    
    set cards(cards: IProduct[]) {
        this._cards = cards;
        this.events.emit('cards:changed');
    };
    get cards() {
        return this._cards;
    };

    addCard(card: IProduct) {
        this._cards = [card, ...this._cards]
        this.events.emit('cards:changed')
    }

    deleteCard(cardId: string, payload: Function | null = null) {
        this._cards = this._cards.filter(card => card._id !== cardId);

        if(payload) {
            payload();
        } else {
            this.events.emit('cards:changed')
        }
    }

    getCard(cardId: string) {
        return this._cards.find((item) => item._id === cardId)
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
    
    checkValidation(data: Record<keyof TCardInfo, string>) {
        //TODO: проверка на то что данные не пустые
        const isValid = true;
        return isValid;
    }

	// checkField(data: { field: keyof TCardInfo; value: string }) {
	// 	switch (data.field) {
	// 		case 'name':
	// 			return this.checkName(data.value);
	// 		case 'link':
	// 			return this.checkLink(data.value);
	// 	}
	// }

	// checkName(value: string) {
    //    const result = validate.single(value, constraintsCard.name, );
    //    if (result) {
    //     return result[0]
    //    } else {
    //     return '';
    //    }
                
	// }

	// checkLink(value: string) {
    //     const result = validate.single(value, constraintsCard.link, );
    //     if (result) {
    //      return result[0]
    //     } else {
    //      return '';
    //     }
    //  }

    get preview () {
        return this._preview;
    }
}

// export class AppState {
//     basket: string[];
//     catalog: LotItem[];
//     loading: boolean;
//     order: IOrder = {
//         email: '',
//         phone: '',
//         items: []
//     };
//     preview: string | null;
//     formErrors: FormErrors = {};

//     toggleOrderedLot(id: string, isIncluded: boolean) {
//         if (isIncluded) {
//             this.order.items = _.uniq([...this.order.items, id]);
//         } else {
//             this.order.items = _.without(this.order.items, id);
//         }
//     }

//     clearBasket() {
//         this.order.items.forEach(id => {
//             this.toggleOrderedLot(id, false);
//             this.catalog.find(it => it.id === id).clearBid();
//         });
//     }

//     getTotal() {
//         return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
//     }

//     setCatalog(items: ILot[]) {
//         this.catalog = items.map(item => new LotItem(item, this.events));
//         this.emitChanges('items:changed', { catalog: this.catalog });
//     }

//     setPreview(item: LotItem) {
//         this.preview = item.id;
//         this.emitChanges('preview:changed', item);
//     }

//     setOrderField(field: keyof IOrderForm, value: string) {
//         this.order[field] = value;

//         if (this.validateOrder()) {
//             this.events.emit('order:ready', this.order);
//         }
//     }

//     validateOrder() {
//         const errors: typeof this.formErrors = {};
//         if (!this.order.email) {
//             errors.email = 'Необходимо указать email';
//         }
//         if (!this.order.phone) {
//             errors.phone = 'Необходимо указать телефон';
//         }
//         this.formErrors = errors;
//         this.events.emit('formErrors:change', this.formErrors);
//         return Object.keys(errors).length === 0;
//     }
// }