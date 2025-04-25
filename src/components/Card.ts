import {Component} from "./base/Component";
import { IProduct } from "../types";
import {bem, createElement, ensureElement, formatNumber} from "../utils/utils";
import { IEvents } from "./base/events";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
    title: string;
    description: string;
    image: string;
    category: string;
}

export class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    _id: string;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _category?: HTMLButtonElement;
    protected events: IEvents;

    constructor(protected blockName: string, container: HTMLElement, events: IEvents) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__text`);
        this._category = container.querySelector(`.${blockName}__category`);
        this._price = container.querySelector(`.${blockName}__price`);
        this.events = events;

        if (this._button) {
            if (this._button.classList.contains('basket__item-delete'))
                this._button.addEventListener('click', () => {this.events.emit('card:delete', {card: this})});
            else
                this._button.addEventListener('click', () => {this.events.emit('card:add', {card: this})});
        } else {
            container.addEventListener('click', () => {this.events.emit('card:select', {card: this})});
        }

    }

    get id(): string {
        return this._id;
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set id(id: string) {
        this._id = id;
    }

    set title(title: string) {
        this.setText(this._title, title);
    }

    set description(description: string) {
        this.setText(this._description, description);
    }

    set price(price: string) {
        this.setText(this._price, `${price} синапсов`);
    }

    set category(category: string) {
        this.setText(this._category, category);
    }

    set image(imglink: string) {
        this.setImage(this._image, imglink, this.title)
    }

}

// export type CatalogItemStatus = {
//     status: LotStatus,
//     label: string
// };

// export class CatalogItem extends Card<CatalogItemStatus> {
//     protected _status: HTMLElement;

//     constructor(container: HTMLElement, actions?: ICardActions) {
//         super('card', container, actions);
//         this._status = ensureElement<HTMLElement>(`.card__status`, container);
//     }

//     set status({ status, label }: CatalogItemStatus) {
//         this.setText(this._status, label);
//         this._status.className = clsx('card__status', {
//             [bem(this.blockName, 'status', 'active').name]: status === 'active',
//             [bem(this.blockName, 'status', 'closed').name]: status === 'closed'
//         });
//     }
// }

// export interface BidStatus {
//     amount: number;
//     status: boolean;
// }

// export class BidItem extends Card<BidStatus> {
//     protected _amount: HTMLElement;
//     protected _status: HTMLElement;
//     protected _selector: HTMLInputElement;

//     constructor(container: HTMLElement, actions?: ICardActions) {
//         super('bid', container, actions);
//         this._amount = ensureElement<HTMLElement>(`.bid__amount`, container);
//         this._status = ensureElement<HTMLElement>(`.bid__status`, container);
//         this._selector = container.querySelector(`.bid__selector-input`);

//         if (!this._button && this._selector) {
//             this._selector.addEventListener('change', (event: MouseEvent) => {
//                 actions?.onClick?.(event);
//             })
//         }
//     }

//     set status({ amount, status }: BidStatus) {
//         this.setText(this._amount, formatNumber(amount));

//         if (status) this.setVisible(this._status);
//         else this.setHidden(this._status);
//     }
// }