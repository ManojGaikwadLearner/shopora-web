import { Country } from "./country.model";
import { Order } from "./order-history.model";
import { ProductCategory } from "./product-cateory.model";
import { Product } from "./product.model";
import { State } from "./state.model";

export interface GetResponseProducts {
    _embedded: {
        products: Product[];
    },
    page : {
        number: number;
        size : number;
        totalElements : number;
        totalPages : number;
    }
}

export interface GetResponseProductCategory {
    _embedded: {
        productCategory: ProductCategory[];
    }
}

export interface GetResponseCountries {
    _embedded: {
        countries: Country[];
    }
}

export interface GetResponseStates {
    _embedded: {
        states: State[];
    }
}

export interface GetResponseOrderHistory {
    _embedded: {
        orders: Order[];
    }
}

