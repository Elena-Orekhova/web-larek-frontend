export interface IProductItem {
	id: string;
	description?: string;
	image?: string;
	title: string;
	category?: string;
	price: number | null;
}

export interface IAppState {
	gallery: IProductItem[];
	basket: string[];
	preview: string | null;
	order: IOrder | null;
}

export type PaymentMethods = 'card' | 'cash';

export interface IOrderForm {
	payment: PaymentMethods;
	address: string;
}

export interface IContactsForm {
	email: string;
	phone: string;
}

export type FieldsInput = Pick<IOrderForm, 'address'> & IContactsForm;

export interface IOrder extends IOrderForm, IContactsForm {
	items: string[];
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
	id: string;
	total: number;
}
