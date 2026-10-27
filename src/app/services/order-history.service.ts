import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GetResponseOrderHistory } from './models/api-responses.model';
import { Order } from './models/order-history.model';

@Service()
export class OrderHistoryService {
    httpClient: HttpClient = inject(HttpClient);
    private readonly baseUrl: string = '/api/orders';
    private readonly searchByCustomerEmailUrl = (customerEmail: string): string => 
        `${this.baseUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${customerEmail}`;

    getOrderHistory(customerEmail: string): Observable<Order[]> {
        return this.httpClient.get<GetResponseOrderHistory>(this.searchByCustomerEmailUrl(customerEmail)).pipe(
                    map(response => response._embedded.orders)
                );
    }
}
