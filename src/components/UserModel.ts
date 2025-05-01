import { FormErrors, IOrder, IOrderForm, Payment } from "../types";
import { IEvents } from "./base/events";

interface IUserData {
    changeField(field: keyof IOrderForm, value: Payment | string): void;
    getPayment(): string;
    getAddress(): string;
    getPhone(): string;
    getEmail(): string;
    getUserInfo(): IOrderForm;
    clearUserInfo(): void;
    validateOrder(): Object;
}


export class UserModel implements IUserData {
    protected email: string;
    protected phone: string;
    protected address: string;
    protected payment: string;
    events: IEvents;
    formErrors: FormErrors = {};

    constructor(events: IEvents) {
            this.events = events;
            this.address = '';
            this.email = '';
            this.phone = '';
            this.payment = '';
    }

    changeField(field: keyof IOrderForm, value: Payment | string) {
        if (field === 'payment' && !this.isPayment(value)) {
            alert('Invalid payment');
            return
          }
        this[field] = value;
        this.events.emit(`user.${field}:changed`);
    }
    
    getPayment() {
        return this.payment;
    }

    getAddress() {
        return this.address;
    }

    getPhone() {
        return this.phone;
    }

    getEmail() {
        return this.email;
    }

    protected isPayment(x: string): x is Payment {
        return ['cash', 'card'].includes(x);
    }

    getUserInfo(): IOrderForm {
        return {
            'email': this.email,
            'phone': this.phone,
            'address': this.address,
            'payment': this.payment,
        };
    }

    clearUserInfo() {
        this.address = '';
        this.email = '';
        this.phone = '';
        this.payment = '';
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this.payment) {
            errors.payment = 'Необходимо выбрать тип оплаты';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}