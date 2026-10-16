import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'product-list',
        pathMatch: 'full'
    },
    {
        path: 'product-list',
        loadComponent: () => import('./components/product-list/product-list').then(m => m.ProductList)
    },
];
