import './scss/styles.scss';

import { LarekAPI } from './components/LarekApi';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { IProduct } from './types';
import { Card } from './components/Card';
import { CardsData } from './components/CardsData';
import { BasketModel } from './components/BasketModel';

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
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

Promise.all([api.getProductList(), ])
    .then(([products, ]) => {
        cardsData.cards = products;
        // console.log(cardsData);
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
    modal.render({content: cardInstant.render(cardsData.getCard(cardId))});
})

const basketData = new BasketModel(events);

events.on<{ cardId: string }>('card:add', ({cardId}) => {
    basketData.add(cardsData.getCard(cardId));
    console.log(basketData);
})

// events.on<{ cardId: string }>('card:delete', ({cardId}) => {
//     basketData.remove(cardId);
//     // console.log(basketData);
// })

const basket = new Basket(cloneTemplate(basketTemplate), events);

events.on('basket:open', () => {
    const cardsArray = basketData.items.map((card) => {
        const cardInstant = new Card('card', cloneTemplate(cardBasketTemplate), events);
        return cardInstant.render(card);
    });
    modal.render({content: basket.render({items: cardsArray})});
})