import _ from "lodash";

import {Model} from "./base/Model";
import { IProductItem, IOrderForm, FormErrors, IAppState, IBasketItem} from "../types";

export type GalleryChangeEvent = {
    gallery: IProductItem[]
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
        this.emitChanges('product:changed', { id: this.id, price, title });
    }
}

export class AppState extends Model<IAppState> {
    basket: string[] = [];
    gallery: ProductItem[];
    loading: boolean;
    order: IOrderForm = {
        payment: 'online',
        address: '',
        email: '',
        phone: '',
    };
    preview: string | null;
    formErrors: FormErrors = {};
    
    toggleOrderedProduct(id: string, isIncluded: boolean) {
        if (isIncluded) {
            this.basket = _.uniq([...this.basket, id]);
        } else {
            this.basket = _.without(this.basket, id);
        }
    }

    clearBasket() {
        this.basket.forEach(id => {
            this.toggleOrderedProduct(id, false);
        });
    }

    getTotal() {
        return this.basket.reduce((a, c) => a + this.gallery.find(it => it.id === c).price, 0)
    }

    setGallery(items: IProductItem[]) {
        this.gallery = items.map(item => new ProductItem(item, this.events));
        this.emitChanges('items:changed', { gallery: this.gallery });
    }

    setPreview(item: IProductItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    getProduct(): IProductItem[] {
        return this.gallery
            .filter(item => item.status)

    }

    // removeProduct(item) {
    //     this.item.remove;
    // }

    // Для удобства добавим метод для проверки, находится ли товар в корзине
    isProductInBasket(productId: string): boolean {
        return this.basket.includes(productId);
    }

    // Для удобства добавим метод для получения объекта товара по его идентификатору
    getProductById(productId: string): ProductItem | undefined {
        return this.gallery.find(item => item.id === productId);
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        if (field === 'payment' && (value === 'online' || value === 'upon-receipt')) {
            this.order[field] = value;
        } else if (field !== 'payment') {
            this.order[field] = value;
        }
    
        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateOrder() {
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

    addToBasket(product: IProductItem) {
        this.basket.push(product.id, product.title);
    }
}
