import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GetResponseProduct, GetResponseProductCategory } from './models/api-responses.model';
import { Product } from './models/product.model';
import { ProductCategory } from './models/product-cateory.model';

@Service()
export class ProductService {

    httpClient: HttpClient = inject(HttpClient);
    private readonly baseUrl: string = '/api/products';
    private readonly categoryUrl: string = '/api/product-category';
    
    constructor() {}

    getProducts(categoryId: number): Observable<Product[]> {
        const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
        return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
            map(response => response._embedded.products)
        );
    }

    getProductCategories(): Observable<ProductCategory[]> {
        return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
            map(response => response._embedded.productCategory)
        );
    }

}
