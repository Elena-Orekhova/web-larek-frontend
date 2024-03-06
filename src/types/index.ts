export interface IProductItem {
  id: string;
  description?: string;
  image: string;
  title: string;
  category: string;
  price: string;
}

export interface IBasketCounter {
  counter: number;
}

export interface IBasket {
  data: IProductItem[];
  price: number;
}

export type IBasketItem = Pick<IProductItem, 'id' | 'title' | 'price'>;

export interface IOrderForm {
  payment: 'online' | 'upon-receipt';
  address: string;

  email: string;
  phone: string;
}

export interface IOrderResult {
  price: string;
}
