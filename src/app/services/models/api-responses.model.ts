import { ProductCategory } from "./product-cateory.model";
import { Product } from "./product.model";

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