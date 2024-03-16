import './scss/styles.scss';

import { ProductAPI } from './components/ProductAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import {
	AppState,
	GalleryChangeEvent,
	ProductItem,
} from './components/AppData';
import { CatalogItem } from './components/Card';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement, createElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import {
	FieldsInput,
	IContactsForm,
	IOrderForm,
	PaymentMethods,
} from './types';
import { Order } from './components/Order';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new ProductAPI(CDN_URL, API_URL);

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
const orderContacts = new Order(cloneTemplate(contactsTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);

// бизнес-логика (события)

// Изменились элементы каталога
events.on<GalleryChangeEvent>('items:changed', () => {
	page.gallery = appData.gallery.map((item) => {
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
});

// Открыть товары в корзине
events.on('basket:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
});

// очистить все после заказа
events.on('basket:clear', () => {
	basket.items = [];
	appData.order.items = [];
	appData.order.total = 0;
	appData.basket = [];
	page.counter = 0;
	basket.total = '0 синапсов';
	basket.selected = [];
	appData.order.payment = null;
	order.selected = '';
});

// форма заказа (адрес и оплата)
events.on('order:submit', () => {
	events.emit('orderContacts:open');
});

// Отправлена форма заказа (контактные данные)
events.on('contacts:submit', () => {
	api
		.orderProducts(appData.order)
		.then((result) => {
			const success = new Success(
				cloneTemplate(successTemplate),
				{
					onClick: () => {
						modal.close();
					},
				},
				result.total
			);
			events.emit('basket:clear');

			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

// Изменилось состояние валидации формы
events.on(
	'formErrors:change',
	(errors: Partial<IOrderForm & IContactsForm>) => {
		const { email, phone, address, payment } = errors;
		orderContacts.valid = !email && !phone;
		orderContacts.errors = Object.values({ phone, email })
			.filter((i) => !!i)
			.join('; ');
		order.valid = !address && !payment;
		order.errors = Object.values({ address, payment })
			.filter((i) => !!i)
			.join('; ');
	}
);

events.on('payment:change', (value: { name: PaymentMethods }) => {
	const { name } = value;
	appData.setOrderField('payment', name);
});

// Изменилось одно из полей
events.on(
	/^(order|contacts)\..*:change/,
	(data: { field: keyof FieldsInput; value: string }) => {
		if (data.field === 'address') {
			appData.setOrderField(data.field, data.value);
		} else {
			appData.setContactsField(data.field, data.value);
		}
	}
);

// Открыть форму заказа (адрес и оплата)
events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: null,
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открыть форму заказа (контактные данные)
events.on('orderContacts:open', () => {
	modal.render({
		content: orderContacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открыть товар
events.on('card:select', (item: ProductItem) => {
	appData.setPreview(item);
});
events.on('preview:changed', (item: ProductItem) => {
	const showItem = (item: ProductItem) => {
		const existingItem = appData.basket.find(
			(product) => item.id === product.id
		);
		const card = new CatalogItem(cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				appData.addToBasket(item);
				events.emit('basket:update');
				page.counter = appData.basket.length;
				if (!existingItem) {
					modal.close();
				}
			},
		});
		card.inBasket = !!existingItem;
		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				category: item.category,
				description: item.description,
				price: item.price,
			}),
		});
	};

	if (item) {
		api
			.getProductItem(item.id)
			.then((result) => {
				item.description = result.description;
				showItem(item);
			})
			.catch((err) => {
				console.error(err);
			});
	}
});

events.on('basket:update', () => {
	basket.total = appData.getTotal();
	basket.items = appData.basket.map((item) => {
		const card = new CatalogItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('basket:remove', { itemId: item.id });
			},
		});

		return card.render({
			title: item.title,
			price: item.price,
		});
	});
	appData.order.items = appData.basket.map(({ id }) => id);
	appData.order.total = appData.basket.reduce(
		(acc, { price }) => price + acc,
		0
	);
	basket.selected = appData.basket;
});

events.on('basket:remove', (id: { itemId: string }) => {
	const index = appData.basket.findIndex((prod) => prod.id === id.itemId);
	if (index !== -1) {
		appData.basket.splice(index, 1);
		events.emit('basket:update');
		page.counter = appData.basket.length;
	} else {
		console.log('Элемент не найден в корзине.');
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
api
	.getProductList()
	.then(appData.setGallery.bind(appData))
	.catch((err) => {
		console.error(err);
	});
