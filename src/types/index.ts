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

// export interface IBasketCounter {
//   counter: number;
// }

// export interface IBasket {
//   data: IProductItem[];
//   price: number | null;
// }

export type IBasketItem = Pick<IProductItem, 'id' | 'title' | 'price'>;

export interface IOrderForm {
  payment: 'online' | 'upon-receipt';
  address: string;

  email: string;
  phone: string;
}

export interface IOrder extends IOrderForm {
  items: string[]
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
  price: number | null;
}
