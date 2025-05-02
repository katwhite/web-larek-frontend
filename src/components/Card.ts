import {Component} from "./base/Component";
import { IProduct } from "../types";
import {bem, createElement, ensureElement, formatNumber} from "../utils/utils";
import { IEvents } from "./base/events";

export interface ICard<T> {
    title: string;
    description: string;
    image: string;
    category: string;
}

const categoryClassMap: Record<string, string> = {
    'cофт-скил': 'soft',
    'хард-скил': 'hard',
    'другое': 'other',
    'дополнительное': 'additional',
    'кнопка': 'button',
}

export class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    _id: string;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected button?: HTMLButtonElement;
    protected _category?: HTMLButtonElement;
    protected events: IEvents;

    constructor(protected blockName: string, container: HTMLElement, events: IEvents) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = container.querySelector(`.${blockName}__image`);
        this.button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__text`);
        this._category = container.querySelector(`.${blockName}__category`);
        this._price = ensureElement<HTMLImageElement>(`.${blockName}__price`, container);
        this.events = events;

        if (this.button) {
            if (this.button.classList.contains('basket__item-delete'))
                this.button.addEventListener('click', (evt) => {
                    this.events.emit('card:delete', {cardId: this._id})
                    evt.stopPropagation();
                });
        } else {
            container.addEventListener('click', () => {this.events.emit('card:select', {cardId: this.id})});
        }

    }

    setButtonListener(state: boolean, onClick: (this: Card<IProduct>)=>void) {
        this.button.addEventListener('click', onClick.bind(this));
        if (state) this.setText(this.button, 'Удалить');
        else this.setText(this.button, 'В корзину');
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

    set price(price: string | null) {
        if (price)
        this.setText(this._price, `${price} синапсов`);
        else {
            this.setText(this._price, `бесценно`);
            this.setDisabled(this.button, true);
        }
    }

    set category(category: string) {
        this.setText(this._category, category);
    }

    set image(imglink: string) {
        this.setImage(this._image, imglink, this.title)
    }

    render(data: Partial<IProduct>): HTMLElement {
        super.render(data);
        if (this._category) {
            this.toggleClass(this._category, `card__category_${categoryClassMap[data.category]}`, true);
        }
        return this.container;
    }

}