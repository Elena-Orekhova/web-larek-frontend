import { Api, ApiListResponse } from './base/api';
import { IOrderForm, IOrderResult, IProductItem } from '../types';

export interface IProductAPI {
	getProductList: () => Promise<IProductItem[]>;
	getProductItem: (id: string) => Promise<IProductItem>;
	orderProducts: (order: IOrderForm) => Promise<IOrderResult>;
}

export class ProductAPI extends Api implements IProductAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductItem(id: string): Promise<IProductItem> {
		return this.get(`/product/${id}`).then((item: IProductItem) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	getProductList(): Promise<IProductItem[]> {
		return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderProducts(order: IOrderForm): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
