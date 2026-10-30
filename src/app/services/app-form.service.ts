import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from './models/country.model';
import { GetResponseCountries, GetResponseStates } from './models/api-responses.model';
import { State } from './models/state.model';

@Service()
export class AppFormService {

    httpClient: HttpClient = inject(HttpClient);
    private readonly countriesUrl: string = '/api/countries';
    private readonly statesUrl: string = '/api/states';
    private readonly searchStatesByCountryCodeUrl = (countryCode: string): string => `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;

    getCountries(): Observable<Country[]> {
        return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
            map(response => response._embedded.countries)
        );
    }

    getStates(countryCode: string): Observable<State[]> {
        return this.httpClient.get<GetResponseStates>(this.searchStatesByCountryCodeUrl(countryCode)).pipe(
            map(response => response._embedded.states)
        );
    }

}
