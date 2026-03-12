export interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  items: CreateOrderItemRequest[];
  discountPercentage: number;
}

export interface OrderItemResponse {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderResponse {
  orderId: string;
  username: string;
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  totalAmount: number;
  items: OrderItemResponse[];
  status: string;
}
