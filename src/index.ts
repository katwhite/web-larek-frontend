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

const events = new EventEmitter();

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

let card = new Card('card', cloneTemplate(cardCatalogTemplate));

const page = new Page(document.body, events);
// page.catalog.map.card.render();

// const modal = new Modal(ensureElement<HTMLElement>('#modal__container'), events);

// const basket = new Basket(cloneTemplate(basketTemplate), events);

// page.catalog = appData.catalog.map(item => {
//     const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
//         onClick: () => events.emit('card:select', item)
//     });
//     return card.render({
//         title: item.title,
//         image: item.image,
//         description: item.about,
//         status: {
//             status: item.status,
//             label: item.statusLabel
//         },
//     });
// });

// page.counter = appData.getClosedLots().length;

// api.getProductList()
//     .then(appData.setCatalog.bind(appData))
//     .catch(err => {
//         console.error(err);
//     });

Promise.all([api.getProductList(),])
    .then(([products, ]) => {
        cardsData.cards = products;
        console.log(cardsData.cards);
    })
    .catch((err) => {
    console.error(err);
    });


// api.getProductList()
//     .then((products: IProduct[]) => {
//         cardsData.cards = products;
//         console.log(cardsData.cards);
//     })

