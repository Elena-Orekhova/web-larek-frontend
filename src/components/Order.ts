import {Form} from "./common/Form";
import {IOrderForm} from "../types";
import {EventEmitter, IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

export class Order extends Form<IOrderForm> {
    private _paymentMethod: 'online' | 'upon-receipt';

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._paymentMethod = 'online';
    }

    set paymentMethod(method: 'online' | 'upon-receipt') {
        this._paymentMethod = method;
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    //слушатель TODO

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}