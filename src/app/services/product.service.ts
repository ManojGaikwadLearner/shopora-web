import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GetResponseProducts, GetResponseProductCategory } from './models/api-responses.model';
import { Product } from './models/product.model';
import { ProductCategory } from './models/product-cateory.model';

@Service()
export class ProductService {

    httpClient: HttpClient = inject(HttpClient);
    private readonly baseUrl: string = '/api/products';
    private readonly searchByCategoryIdUrl = (categoryId: number): string => `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    private readonly productListPaginatedUrl = (categoryId: number, pageNumber: number, pageSize: number): string => `${this.searchByCategoryIdUrl(categoryId)}&page=${pageNumber}&size=${pageSize}`;
    private readonly searchByNameContainingUrl = (name: string): string => `${this.baseUrl}/search/findByNameContaining?name=${name}`;
    private readonly categoryUrl: string = '/api/product-category';
    private readonly productUrl = (productId: number): string => `${this.baseUrl}/${productId}`;

    getProductsByCategoryId(categoryId: number): Observable<GetResponseProducts> {
        return this.getProducts(this.searchByCategoryIdUrl(categoryId));
    }

    searchProducts(keyword: string): Observable<GetResponseProducts> {
        return this.getProducts(this.searchByNameContainingUrl(keyword));
    }

    private getProducts(url: string): Observable<GetResponseProducts> {
        return this.httpClient.get<GetResponseProducts>(url);
    }

    getProductListPaginated(categoryId: number, thePageNumber: number, thePageSize: number): Observable<GetResponseProducts> {
        return this.httpClient.get<GetResponseProducts>(this.productListPaginatedUrl(categoryId, thePageNumber, thePageSize));
    }

    getProductCategories(): Observable<ProductCategory[]> {
        return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
            map(response => response._embedded.productCategory)
        );
    }

    getProduct(productId: number): Observable<Product> {
        return this.httpClient.get<Product>(this.productUrl(productId));
    }

}
