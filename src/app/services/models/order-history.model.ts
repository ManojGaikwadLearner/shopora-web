export interface Order {
    id: number;
    orderTrackingNumber: number;
    totalPrice: number;
    totalQuantity: number;
    dateCreated: Date;
}