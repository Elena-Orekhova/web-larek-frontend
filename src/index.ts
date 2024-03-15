import './scss/styles.scss';

import {ProductAPI} from "./components/ProductAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState, GalleryChangeEvent, ProductItem} from "./components/AppData";
import {CatalogItem, BasketItem} from "./components/Card";
import {Page} from "./components/Page";
import {cloneTemplate, ensureElement, createElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/common/Basket";
import {IOrderForm, IProductItem} from "./types";
import {Order} from "./components/Order";
import {Success} from "./components/common/Success";

const events = new EventEmitter();
const api = new ProductAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appData = new AppState({}, events);


// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(contactsTemplate), events);
const orderfirst = new Order(cloneTemplate(orderTemplate), events);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<GalleryChangeEvent>('items:changed', () => {
    page.gallery = appData.gallery.map(item => {
        const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item),
        });
        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price,
        });
    });
    // page.counter = appData.getProduct().length;
})

// Открыть товары в корзине
events.on('basket:open', () => {
    modal.render({
        content: createElement<HTMLElement>('div', {}, [
            basket.render()
        ])
    });
});

// Изменения в товаре
// events.on('product:changed', () => {
    // page.counter = appData.getProduct().length;
    // let total = 0;
    // basket.items = appData.getProduct().map(item => {
    //     const card = new CatalogItem(cloneTemplate(cardBasketTemplate), {
    //         onClick: () => {
    //             //удаление из корзины ?????
    //             // basket.total = appData.getTotal();
    //             // basket.selected = appData.basket;
    //         }
    //         // events.emit('preview:changed', item)
    //     });
    //     // return card.render({
    //     //     title: item.title,
    //     //     price: item.price,
    //     // });
    // });
    // basket.total = total;
// })

// Отправлена форма заказа
events.on('order:submit', () => {
    api.orderProducts(appData.order)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    // appData.clearBasket();
                    events.emit('auction:changed');
                }
            });

            modal.render({
                content: success.render({})
            });
        })
        .catch(err => {
            console.error(err);
        });
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { email, phone } = errors;
    order.valid = !email && !phone;
    order.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
});

// Открыть первую форму заказа
events.on('orderfirst:open', () => {
    modal.render({
        content: orderfirst.render({
            payment: 'online',
            address: '',
            valid: false,
            errors: []
        })
    });
});

// Открыть форму заказа
events.on('order:open', () => {
    modal.render({
        content: order.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        })
    });
});

// Открыть товар
events.on('card:select', (item: ProductItem) => {
    appData.setPreview(item);
});

// Изменен открытый выбранный товар
events.on('preview:changed', (item: ProductItem) => {
    const showItem = (item: ProductItem) => {

        const card = new CatalogItem(cloneTemplate(cardPreviewTemplate), {
            onClick: () => {
                appData.addToBasket(item);
                basket.total = appData.getTotal();
                basket.items = appData.basket.map(item => {
                    const card = new CatalogItem(cloneTemplate(cardBasketTemplate), {
                        onClick: () => {
                            //удаление из корзины ?????
                            // basket.total = appData.getTotal();
                            // basket.selected = appData.basket;
                        }
                        // events.emit('preview:changed', item)
                    });
                    return card.render({
                        title: item.title,
                        price: item.price,
                    });
                });
                // изменить статус кнопки на купить
                // по нажатию на кнопку купить переходишь в корзину
                page.counter = appData.basket.length;
            }
        })

        modal.render({
            content: card.render({
                title: item.title,
                image: item.image,
                category: item.category,
                description: item.description,
                price: item.price,
            })
        });
    };

    if (item) {
        api.getProductItem(item.id)
            .then((result) => {
                item.description = result.description;
                showItem(item);
            })
            .catch((err) => {
                console.error(err);
            })
    } else {
        modal.close();
    }
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем товары с сервера
api.getProductList()
    .then(appData.setGallery.bind(appData))
    .catch(err => {
        console.error(err);
    });




