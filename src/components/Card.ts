import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard {
	title: string;
	image?: string;
	price: number | null;
	category?: string;
	description?: string;
	button?: string;
}

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _price: HTMLElement;
	protected _category?: HTMLElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = container.querySelector(`.${blockName}__image`);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._category = container.querySelector(`.${blockName}__category`);
		this._description = container.querySelector(`.${blockName}__text`);
		this._button = container.querySelector(`.${blockName}__button`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set inBasket(value: boolean) {
		if (value && this._button) {
			this._button.innerText = 'Удалить из корзины';
		}
	}

	get price(): string {
		return this._price.textContent;
	}

	set price(value: string) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
			this._button?.setAttribute('disabled', 'disabled');
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}

	set description(value: string | string[]) {
		this.setText(this._description, value);
	}
}

export class CatalogItem extends Card {
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
		this._button = container.querySelector('.card__button');

		if (this._button && actions?.onClick) {
			this._button.addEventListener('click', actions.onClick);
		}
	}

	set inBasket(value: boolean) {
		if (this._button) {
			if (value) {
				this._button.innerText = 'Перейти в корзину';
			} else {
				this._button.innerText = 'Добавить в корзину';
			}
		}
	}
}

export class BasketItem extends Card {
	protected _title: HTMLElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);

		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);

		this._price.addEventListener('change', (event: MouseEvent) => {
			actions?.onClick?.(event);
		});
	}
}
