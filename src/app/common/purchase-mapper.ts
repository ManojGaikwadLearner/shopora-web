import { CartItem } from "../services/models/cart-item.model";
import { AddressDto, CustomerDto, OrderDto, OrderItemDto, PurchaseDto } from "./purchase";


export function toOrderDto(formValue: any, cartItems: CartItem[], totalQuantity: number, totalPrice: number): PurchaseDto {

    const customer: CustomerDto = {
        firstName: formValue.customer.firstName.trim(),
        lastName: formValue.customer.lastName.trim(),
        email: formValue.customer.email.trim().toLowerCase(),
    };

    const shippingAddress: AddressDto = toAddressDto(formValue.shippingAddress);
    const billingAddress: AddressDto = toAddressDto(formValue.billingAddress);

    const order: OrderDto = {
        totalQuantity: totalQuantity,
        totalPrice: totalPrice
    };

    const orderItems: OrderItemDto[] = [];

    cartItems.forEach(cartItem => {
        const orderItem: OrderItemDto = {
            productId: cartItem.id,
            quantity: cartItem.quantity,
            unitPrice: cartItem.unitPrice,
            imageUrl: cartItem.imageUrl,
        };
        orderItems.push(orderItem);
    });

    const purchase: PurchaseDto = {
        customer: customer,
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        order: order,
        orderItems: orderItems
    }

    return purchase;

}

function toAddressDto(address: any): AddressDto {
  return {
    street: address.street.trim(),
    city: address.city.trim(),
    state: address.state?.name ?? '',
    country: address.country?.name ?? '',
    zipCode: address.zipCode.trim(),
  };
}