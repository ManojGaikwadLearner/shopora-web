import { Routes } from '@angular/router';
import { Login } from './features/login/login';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'product-list',
        pathMatch: 'full'
    },
    {   
        path: 'login',
        component: Login 
    },
    {
        path: 'product-list',
        loadComponent: () => import('./features/product-list/product-list').then(m => m.ProductList)
    },
    {
        path: 'search/:keyword',
        loadComponent: () => import('./features/product-list/product-list').then(m => m.ProductList)
    },
    {
        path: 'category/:id',
        loadComponent: () => import('./features/product-list/product-list').then(m => m.ProductList)
    },
    {
        path: 'category',
        loadComponent: () => import('./features/product-list/product-list').then(m => m.ProductList)
    },
    {
        path: 'product/:id',
        loadComponent: () => import('./features/product-details/product-details').then(m => m.ProductDetails)
    },
    {
        path: 'cart-details',
        loadComponent: () => import('./features/cart-details/cart-details').then(m => m.CartDetails)
    },
    {
        path: 'checkout',
        loadComponent: () => import('./features/checkout/checkout').then(m => m.Checkout)
    },
    {
        path: 'page-not-found',
        loadComponent: () => import('./components/page-not-found/page-not-found').then(m => m.PageNotFound)
    },
    {
        path: '**',
        redirectTo: 'page-not-found',
    },
];
