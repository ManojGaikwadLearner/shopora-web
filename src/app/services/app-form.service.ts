import { Service } from '@angular/core';
import { Observable, of } from 'rxjs';

@Service()
export class AppFormService {
    getCreditCardMonths(startMonth: number): Observable<number[]> {
        const months: number[] = [];

        for (let month = startMonth; month <= 12; month++) {
            months.push(month);
        }

        return of(months);
    }

    getCreditCardYears(): Observable<number[]> {
        let years: number[] = [];

        const startYear = new Date().getFullYear();
        const endYear = startYear + 10;

        for (let year = startYear; year <= endYear; year++) {
            years.push(year);
        }

        return of(years);
    }


}
