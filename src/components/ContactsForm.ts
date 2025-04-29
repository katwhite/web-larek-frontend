import {Form} from "./base/Form";
import {IOrderForm} from "../types";
import {EventEmitter, IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

export class ContactsForm extends Form<IOrderForm> {

    protected phoneInput: HTMLInputElement;
    protected emailInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.phoneInput = this.container.elements.namedItem('phone') as HTMLInputElement;
        this.emailInput = this.container.elements.namedItem('email') as HTMLInputElement;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    checkValidation() {
        if (this.phoneInput.value === '') return false;
        if (this.emailInput.value === '') return false;
        else return true;
    }
}