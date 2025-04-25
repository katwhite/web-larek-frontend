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

let card = new Card('card', cloneTemplate(cardCatalogTemplate), events);

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

const testCards = [​
    { category: "софт-скил",
    description: "Если планируете решать задачи в тренажёре, берите два.",
    _id: "854cef69-976d-4c2a-a18c-2aa45046c390",
    image: "https://larek-api.nomoreparties.co/content/weblarek/5_Dots.svg",
    price: 750,
    title: "+1 час в сутках"
    },
    { category: "другое",
      description: "Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.",
        _id: "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
        image: "https://larek-api.nomoreparties.co/content/weblarek/Shell.svg",
        price: 1450,
        title: "HEX-леденец"
    },
    {category: "софт-скил",
        description: "Будет стоять над душой и не давать прокрастинировать.",
        _id: "b06cde61-912f-4663-9751-09956c0eed67",
        image: "https://larek-api.nomoreparties.co/content/weblarek/Asterisk_2.svg",
        price: null,
        title: "Мамка-таймер"
    },
    { category: "дополнительное",
        description: "Откройте эти куки, чтобы узнать, какой фреймворк вы должны изучить дальше.",
        _id: "412bcf81-7e75-4e70-bdb9-d3c73c9803b7",
        image: "https://larek-api.nomoreparties.co/content/weblarek/Soft_Flower.svg",
        price: 2500,
        title: "Фреймворк куки судьбы"
    }
];

Promise.all([api.getProductList(),])
    .then(([products, ]) => {
        cardsData.cards = products;
    })
    .catch((err) => {
    console.error(err);
    });

const testSection = document.querySelector('.gallery');
card.setData(testCards[1]);
card.category = 'новая категория';
testSection.append(card.render());

