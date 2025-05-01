import './scss/styles.scss';

import { LarekAPI } from './components/LarekApi';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { IOrderForm, IProduct, Payment } from './types';
import { Card } from './components/Card';
import { CardsData } from './components/CardsData';
import { BasketModel } from './components/BasketModel';
import { Form } from './components/base/Form';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/Success';
import { UserModel } from './components/UserModel';

const events = new EventEmitter();
const cardsData = new CardsData(events);
const api = new LarekAPI(CDN_URL, API_URL);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(document.body, events);
const basketData = new BasketModel(events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderFormTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsFormTemplate), events);
const userModel = new UserModel(events);
const success = new Success(cloneTemplate(successTemplate), {onClick: () => {modal.close();}});

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

events.on('initialData:loaded', () => {
    const cardsArray = cardsData.cards.map((card) => {
        const cardInstant = new Card('card', cloneTemplate(cardCatalogTemplate), events);
        return cardInstant.render(card);
    });
    page.render({catalog: cardsArray});
})

events.on<{ cardId: string }>('card:select', ({cardId}) => {
    const cardInstant = new Card('card', cloneTemplate(cardPreviewTemplate), events);
    if (basketData.items.some(item => item.id === cardId)) cardInstant.setButton(true);
    else cardInstant.setButton(false);
    modal.render({content: cardInstant.render(cardsData.getCard(cardId))});
})

events.on<{ cardId: string }>('card:add', ({cardId}) => {
    basketData.add(cardsData.getCard(cardId));
})

events.on<{ cardId: string }>('card:delete', ({cardId}) => {
    basketData.remove(cardId, cardsData.getCard(cardId).price);
})

events.on('basket:changed', () => {
    const cardsArray = basketData.items.map((card) => {
        const cardInstant = new Card('card', cloneTemplate(cardBasketTemplate), events);
        return cardInstant.render(card);
    });
    basket.total = basketData.getTotal();
    page.counter = basketData.items.length;
    if (basketData.items.length === 0) {
        basket.button = true;
    }
    else {
        basket.button = false;
    }
    basket.render({items: cardsArray});
})

events.on('basket:open', () => {
    modal.render({content: basket.render()});
})

events.on('order:open', () => {
    modal.render({content: orderForm.render({
        valid: userModel.validateOrder(), 
        errors: [],
        payment: userModel.getPayment(),
        address: userModel.getAddress()
        })
    })
})

events.on(/^[a-zA-Z]+\.[a-zA-Z]+:change$/, (data: {field: keyof IOrderForm, value: string}) => {
        userModel.changeField(data.field, data.value);
        userModel.validateOrder();
})

events.on(/^user\..*:changed/, () => {
    orderForm.render({
        valid: userModel.validateOrder(),
        errors: [],
        address: userModel.getAddress(),
        payment: userModel.getPayment()
    });
    contactsForm.render({
        valid: userModel.validateOrder(),
        errors: [],
        phone: userModel.getPhone(),
        email: userModel.getEmail()
    })
})

events.on('order:submit', () => {
    modal.render({content: contactsForm.render({
            valid: userModel.validateOrder(),
            errors: [],
            phone: userModel.getPhone(),
            email: userModel.getEmail()
        })
    })
})

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { email, phone, address, payment } = errors;
    const isOrderValid = !address && !payment;
    orderForm.valid = isOrderValid;
    if (isOrderValid) orderForm.render({
        valid: isOrderValid,
        errors: [],
        payment: userModel.getPayment(),
        address: userModel.getAddress()
    });
    orderForm.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
    contactsForm.valid = !email && !phone;
    contactsForm.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

events.on('contacts:submit', () => {
    const orderData = {
        ... userModel.getUserInfo(),
        items: (basketData.items.map(item => {return item.id})),
        total: basketData.getTotal()
    };
    api.orderProducts(orderData)
    .then( (res) => {
      basketData.clearBasket();
      userModel.clearUserInfo();
      events.emit('basket:changed');
      success.setTotal(res.total);
      modal.render({content: success.render()});
    })
    .catch((err) => {
        console.error(err);
    }); 
})

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

api.getProductList()
    .then((products) => {
        cardsData.cards = products;
    })
    .catch((err) => {
    console.error(err);
    });