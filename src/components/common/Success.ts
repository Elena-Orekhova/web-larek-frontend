import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _count: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions, count: number) {
		super(container);

		this._close = ensureElement<HTMLElement>('.button', this.container);
		this._count = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		this._count.innerText = `Списано ${count} синапсов`;

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}
}
