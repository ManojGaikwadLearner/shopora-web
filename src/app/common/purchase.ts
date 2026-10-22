export interface CustomerDto {
  firstName: string;
  lastName: string;
  email: string;
}

export interface AddressDto {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface OrderDto {
    totalPrice: number; 
    totalQuantity: number;
}

export interface OrderItemDto {
  productId: number;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
}

export interface PurchaseDto {
  customer: CustomerDto;
  shippingAddress: AddressDto;
  billingAddress: AddressDto;
  order: OrderDto;
  orderItems: OrderItemDto[];
}

export interface PurchaseResponse {
  orderTrackingNumber: string;
}