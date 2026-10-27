export const PATHS = {
  login: '/login',
  productList: '/product-list',
  search: '/search',
  category: '/category',
  product: '/product',
  cartDetails: '/cart-details',
  orderHistory: '/order-history',
  checkout: '/checkout',
  membersPage: '/members-page',
  pageNotFound: '/page-not-found',
  about: '/about',
  contact: '/contact',
  help: '/help'
} as const;

export const route = (path: string): string => path.replace(/^\//, '');

/** Same, with parameter segments appended: segment(PATHS.product, ':id') -> 'product/:id' */
export function segment<T extends string>(path: T, ...parts: string[]): string {
  return [route(path), ...parts].join('/');
}