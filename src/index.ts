import './scss/styles.scss';

import { LarekAPI } from './components/LarekApi';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { IProduct, Payment } from './types';
import { Card } from './components/Card';
import { CardsData } from './components/CardsData';
import { BasketModel } from './components/BasketModel';
import { Form } from './components/base/Form';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/Success';
import { UserModel } from './components/UserModel';

const events = new EventEmitter();
events.onAll((event) => console.log(event.eventName, '; ', event.data));

const cardsData = new CardsData(events);

const api = new LarekAPI(CDN_URL, API_URL);
// const appData = new AppState({}, events);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

api.getProductList()
    .then((products) => {
        cardsData.cards = products;
    })
    .catch((err) => {
    console.error(err);
    });

const page = new Page(document.body, events);

events.on('initialData:loaded', () => {
    const cardsArray = cardsData.cards.map((card) => {
        const cardInstant = new Card('card', cloneTemplate(cardCatalogTemplate), events);
        return cardInstant.render(card);
    });
    page.render({catalog: cardsArray});
})

events.on<{ cardId: string }>('card:select', ({cardId}) => {
    const cardInstant = new Card('card', cloneTemplate(cardPreviewTemplate), events);
    if (basketData.items.some(item => item.id === cardId)) cardInstant.button = true;
    else cardInstant.button = false;
    modal.render({content: cardInstant.render(cardsData.getCard(cardId))});
})

const basketData = new BasketModel(events);

events.on<{ cardId: string }>('card:add', ({cardId}) => {
    basketData.add(cardsData.getCard(cardId));
    page.counter = basketData.items.length;
    modal.close();
})

events.on<{ cardId: string }>('card:delete', ({cardId}) => {
    basketData.remove(cardId, cardsData.getCard(cardId).price);
    page.counter = basketData.items.length;
    events.emit('basket:open');
})

const basket = new Basket(cloneTemplate(basketTemplate), events);

events.on('basket:open', () => {
    const cardsArray = basketData.items.map((card) => {
        const cardInstant = new Card('card', cloneTemplate(cardBasketTemplate), events);
        return cardInstant.render(card);
    });
    if (basketData.items.length === 0) {
        basket.button = true;
        basket.total = 0;
    }
    else {
        basket.button = false;
        basket.total = basketData.total;
    }
    modal.render({content: basket.render({items: cardsArray})});
})

const orderForm = new OrderForm(cloneTemplate(orderFormTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsFormTemplate), events);
const userModel = new UserModel(events);

events.on('order:open', () => {
    modal.render({content: orderForm.render({valid: false, errors: []})
    })
})

events.on<{ field: string, value: string }>('order.address:change', ({field, value}) => {
    orderForm.valid = orderForm.checkValidation();
    userModel.changeAddress(value);
})

events.on('payment:change', (data: { payment: Payment }) => {
    userModel.changePayment(data.payment);
    orderForm.valid = orderForm.checkValidation();
})

events.on('payment:changed', () => {
    orderForm.render({
        valid: true,
        errors: [],
        payment: userModel.getPayment()
    });
})

events.on('address:changed', () => {
    orderForm.render({
        valid: true,
        errors: [],
        address: userModel.getAddress()
    });
})

// events.on<{ field: string, value: string }>(/^contacts\..*:change/, ({field, value}) => {
//     if (value) contactsForm.valid = true;
//     else contactsForm.valid = false;
// })

events.on('order:submit', () => {
    modal.render({content: contactsForm.render({
            valid: false,
            errors: []
        })
    })
})

events.on('contacts.phone:change', (data: { phone: string }) => {
    userModel.changePhone(data.phone);
    contactsForm.valid = contactsForm.checkValidation();
})

events.on('phone:changed', () => {
    contactsForm.render({
        valid: true,
        errors: [],
        phone: userModel.getPhone()
    });
})

events.on('contacts.email:change', (data: { email: string }) => {
    userModel.changeEmail(data.email);
    contactsForm.valid = contactsForm.checkValidation();
})

events.on('email:changed', () => {
    contactsForm.render({
        valid: true,
        errors: [],
        email: userModel.getEmail()
    });
})

const success = new Success(cloneTemplate(successTemplate), {onClick: () => {

}
});

events.on('contacts:submit', () => {
    console.log(basketData.total);
    const orderData = {
        ... userModel.getUserInfo(),
        email: '',
        phone: '',
        address: '',
        payment: 'card',
        items: basketData.items,
        total: basketData.total,
    }
    success.setTotal(basketData.total);
    modal.render({content: success.render()});
    // api.orderProducts(orderData)
    // .then( (res) => {
    //   basketData.clearBasket();
    // //   userModel.clearData();
    //   modal.render({content: success.render({total: res.total})});
    // })
    // .catch((err) => {
    //     console.error(err);
    // }); 
})

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});