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

const categoryClassMap: Record<string, string> = {
    'cофт-скил': 'soft',
    'хард-скил': 'hard',
    'другое': 'other',
    'дополнительное': 'additional',
    'кнопка': 'button',
}

function cardDelete (this: Card<IProduct>, evt:MouseEvent) {
    this.events.emit('card:delete', {cardId: this.id});
    evt.stopPropagation();
    this.setButton(false);
}

function cardAdd (this: Card<IProduct>) {
    this.events.emit('card:add', {cardId: this.id});
    this.setButton(true);
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
    protected boundCardAdd;
    protected boundCardDelete;

    constructor(protected blockName: string, container: HTMLElement, events: IEvents) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = container.querySelector(`.${blockName}__image`);
        this.button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__text`);
        this._category = container.querySelector(`.${blockName}__category`);
        this._price = ensureElement<HTMLImageElement>(`.${blockName}__price`, container);
        this.events = events;
        this.boundCardAdd = cardAdd.bind(this);
        this.boundCardDelete = cardDelete.bind(this);

        if (this.button) {
            if (this.button.classList.contains('basket__item-delete'))
                this.button.addEventListener('click', this.boundCardDelete);
            else
                this.button.addEventListener('click', this.boundCardAdd);
        } else {
            container.addEventListener('click', () => {this.events.emit('card:select', {cardId: this.id})});
        }

    }

    setButton(state: boolean) {
        if (state) {
            this.setText(this.button, 'Удалить');
            this.button.addEventListener('click', this.boundCardDelete);
            this.button.removeEventListener('click', this.boundCardAdd)
        }
        else {
            this.setText(this.button, 'В корзину');
            this.button.addEventListener('click', this.boundCardAdd);
            this.button.removeEventListener('click', this.boundCardDelete)
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