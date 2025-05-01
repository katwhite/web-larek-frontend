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
    modal.close();
})

events.on<{ cardId: string }>('card:delete', ({cardId}) => {
    basketData.remove(cardId, cardsData.getCard(cardId).price);
})

const basket = new Basket(cloneTemplate(basketTemplate), events);

events.on('basket:changed', () => {
    const cardsArray = basketData.items.map((card) => {
        const cardInstant = new Card('card', cloneTemplate(cardBasketTemplate), events);
        return cardInstant.render(card);
    });
    basket.total = basketData.getTotal();
    page.counter = basketData.items.length;
    basket.render({items: cardsArray});
})

events.on('basket:open', () => {
    if (basketData.items.length === 0) {
        basket.button = true;
    }
    else {
        basket.button = false;
    }
    modal.render({content: basket.render()});
})

const orderForm = new OrderForm(cloneTemplate(orderFormTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsFormTemplate), events);
const userModel = new UserModel(events);

events.on('order:open', () => {
    modal.render({content: orderForm.render({
        valid: userModel.validateOrder(), 
        errors: []
        })
    })
})

events.on('order.address:change', (data: {value: string}) => {
    userModel.changeAddress(data.value);
    userModel.validateOrder();
})

events.on('address:changed', () => {
    orderForm.render({
        valid: userModel.validateOrder(),
        errors: [],
        address: userModel.getAddress()
    });
})

events.on('payment:change', (data: { payment: Payment }) => {
    userModel.changePayment(data.payment);
    userModel.validateOrder();
})

events.on('payment:changed', () => {
    orderForm.render({
        valid: userModel.validateOrder(),
        errors: [],
        payment: userModel.getPayment()
    });
})

events.on('order:submit', () => {
    modal.render({content: contactsForm.render({
            valid: userModel.validateOrder(),
            errors: []
        })
    })
})

events.on('contacts.phone:change', (data: { value: string }) => {
    userModel.changePhone(data.value);
    contactsForm.valid = userModel.validateOrder();
})

events.on('phone:changed', () => {
    contactsForm.render({
        valid: userModel.validateOrder(),
        errors: [],
        phone: userModel.getPhone()
    });
})

events.on('contacts.email:change', (data: { value: string }) => {
    userModel.changeEmail(data.value);
    contactsForm.valid = userModel.validateOrder();
})

events.on('email:changed', () => {
    contactsForm.render({
        valid: userModel.validateOrder(),
        errors: [],
        email: userModel.getEmail()
    });
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

const success = new Success(cloneTemplate(successTemplate), {onClick: () => {
    modal.close();
}
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
      orderForm.render({
        payment: userModel.getPayment(),
        valid: false,
        errors: []
      }).reset();
      contactsForm.render({
        valid: false,
        errors: []
      }).reset();
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