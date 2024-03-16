import _ from 'lodash';

import { Model } from './base/Model';
import {
	IProductItem,
	IOrder,
	IOrderForm,
	FormErrors,
	IAppState,
	IContactsForm,
} from '../types';

export type GalleryChangeEvent = {
	gallery: IProductItem[];
};

export class ProductItem extends Model<IProductItem> {
	description?: string;
	id: string;
	image: string;
	title: string;
	price: number | null;
	category: string;
	status: boolean;

	placeBasket(price: number, title: string) {
		this.price = price;
		this.title = title;
	}
}

export class AppState extends Model<IAppState> {
	basket: ProductItem[] = [];
	gallery: ProductItem[];
	loading: boolean;
	order: IOrder = {
		payment: null,
		address: '',
		email: '',
		phone: '',
		items: [],
		total: 0,
	};
	preview: string | null;
	formErrors: FormErrors = {};

	getTotal(): string {
		const total = this.basket.reduce((acc, item) => acc + (item.price || 0), 0);
		return `${total} синапсов`;
	}

	setGallery(items: IProductItem[]) {
		this.gallery = items.map((item) => new ProductItem(item, this.events));
		this.emitChanges('items:changed', { gallery: this.gallery });
	}

	setPreview(item: IProductItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	getProduct(): IProductItem[] {
		return this.gallery;
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		if (field === 'payment' && (value === 'card' || value === 'cash')) {
			this.order[field] = value;
		} else if (field !== 'payment') {
			this.order[field] = value;
		}

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setContactsField(field: keyof IContactsForm, value: string) {
		this.order[field] = value;
		if (this.validateContacts()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};

		if (this.order.payment === null) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	addToBasket(product: ProductItem) {
		const existingItem = this.basket.find((item) => item.id === product.id);
		if (existingItem) {
			this.events.emit('basket:open');
		} else {
			this.basket.push(product);
			const totalPrice = this.getTotal();
			const eventData = { totalPrice: totalPrice, unit: 'синапсов' };
			this.events.emit('basket:totalChanged', eventData);
		}
	}
}
