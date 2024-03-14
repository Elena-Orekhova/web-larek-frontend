import {Component} from "./base/Component";
import {IProductItem} from "../types";
import {ensureElement, formatNumber} from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
    title: string;
    image?: string;
    price: number | null;
    category?: string;
    description?: string;
    // button?: string;
    // status: T;
}

export class Card<T> extends Component<ICard<T>> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _price: HTMLElement;
    protected _category?: HTMLElement;
    protected _description?: HTMLElement;
    // protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = container.querySelector(`.${blockName}__image`);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        this._category = container.querySelector(`.${blockName}__category`);
        this._description = container.querySelector(`.${blockName}__text`);
        // this._button = container.querySelector(`.${blockName}__button`);

        // if (this._button && actions?.onClick) {
        //     this._button.addEventListener('click', actions.onClick);
        // }

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
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
        this.setImage(this._image, value, this.title)
    }

    set category(value: string) {
        this.setText(this._category, value);
    }

    get category(): string {
        return this._category.textContent || '';
    }

    get price(): string {
        return this._price.textContent;
    }

    set price(value: string) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }

    set description(value: string | string[]) {
        this.setText(this._description, value);
    }
}

export type BasketButton = {
    button: string,
};

export class CatalogItem extends Card<BasketButton> {
    protected _button: HTMLButtonElement;


    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
        this._button = container.querySelector(`.card__button`);

        if (this._button && actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
        
    }
}

export class BasketItem extends Card<never> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

   
    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);

        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._price = ensureElement<HTMLElement>(`.card__price`, container);

        this._price.addEventListener('change', (event: MouseEvent) => {
            actions?.onClick?.(event);
        })
    }
}
