import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';

@Service()
export class ProductService {

    httpClient: HttpClient = inject(HttpClient);
    private readonly baseUrl: string = '/api/products';

    constructor() {}

    getProducts(): Observable<Product[]> {
        return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
            map(response => response._embedded.products)
        );
    }

}

interface GetResponse {
    _embedded: {
        products: Product[];
    }
}
