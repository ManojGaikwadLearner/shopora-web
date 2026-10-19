import { ProductCategory } from "./product-cateory.model";
import { Product } from "./product.model";

export interface GetResponseProduct {
    _embedded: {
        products: Product[];
    }
}

export interface GetResponseProductCategory {
    _embedded: {
        productCategory: ProductCategory[];
    }
}