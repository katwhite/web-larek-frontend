import {Form} from "./base/Form";
import {IOrderForm} from "../types";
import {EventEmitter, IEvents} from "./base/events";
import {ensureAllElements, ensureElement} from "../utils/utils";

export class OrderForm extends Form<IOrderForm> {

    protected paymentOptions: HTMLButtonElement[];
    protected paymentChosen = false;
    protected addressInput: HTMLInputElement;
    // protected cashPayment: HTMLButtonElement;
    // protected cardPayment: HTMLButtonElement;
    
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.paymentOptions = ensureAllElements<HTMLButtonElement>('.button[type=button]', this.container);

        this.paymentOptions.forEach((button) => {
            button.addEventListener('click', () => {
                // this.onInputChange(this.container, button.name);
              this.events.emit('payment:change', { payment: button.name });
            });
          });

        this.addressInput = this.container.elements.namedItem('address') as HTMLInputElement;

    }

    set payment(payment: string){
        this.paymentOptions.forEach((button) => {
            if (button.name === payment) {
                this.toggleClass(button, 'button_alt-active', true);
            }
            else this.toggleClass(button, 'button_alt-active', false);
        });
        this.paymentChosen = true; // TODO: убрать, перенести в нормальную валидацию потом
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

}