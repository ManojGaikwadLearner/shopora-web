import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';
import { Login } from './features/login/login';
import { PATHS, route, segment } from './common/app-paths';

const productList = () => import('./features/product-list/product-list').then(m => m.ProductList);

export const routes: Routes = [
    {
        path: '',
        redirectTo: route(PATHS.productList),
        pathMatch: 'full'
    },
    {   
        path: route(PATHS.login),
        title: 'Sign in',
        component: Login 
    },
    {
        path: route(PATHS.productList),
        title: 'Products',
        loadComponent: productList
    },
    {
        path: segment(PATHS.search, ':keyword'),
        title: 'Search results',
        loadComponent: productList
    },
    {
        path: segment(PATHS.category, ':id'),
        title: 'Category',
        loadComponent: productList
    },
    {
        path: route(PATHS.category),
        title: 'Categories',
        loadComponent: productList
    },
    {
        path: segment(PATHS.product, ':id'),
        title: 'Product details',
        loadComponent: () => import('./features/product-details/product-details').then(m => m.ProductDetails)
    },
    {
        path: route(PATHS.cartDetails),
        title: 'Your Cart',
        canActivate: [authGuardFn],
        loadComponent: () => import('./features/cart-details/cart-details').then(m => m.CartDetails)
    },
    {
        path: route(PATHS.orderHistory),
        title: 'Your Orders',
        canActivate: [authGuardFn],
        loadComponent: () => import('./features/order-history/order-history').then(m => m.OrderHistory)
    },
    {
        path: route(PATHS.checkout),
        title: 'Checkout',
        canActivate: [authGuardFn],
        loadComponent: () => import('./features/checkout/checkout').then(m => m.Checkout)
    },
    {
        path: route(PATHS.membersPage),
        title: 'Members',
        canActivate: [authGuardFn],
        loadComponent: () => import('./features/members-page/members-page').then(m => m.MembersPage)
    },
    {
        path: route(PATHS.pageNotFound),
        title: 'Page not found',
        loadComponent: () => import('./components/page-not-found/page-not-found').then(m => m.PageNotFound)
    },
    {
        path: '**',
        redirectTo: route(PATHS.pageNotFound),
    },
];
