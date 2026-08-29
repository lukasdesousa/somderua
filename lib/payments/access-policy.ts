export type OrderAccessPolicyInput = {
  checkoutMode: string;
  orderAccessVersion: number;
};

/**
 * Orders created before signed e-mail links existed keep their original UUID
 * capability-link behavior. Every new Pix order requires the signed token.
 */
export function requiresSignedOrderAccess(order: OrderAccessPolicyInput): boolean {
  return order.checkoutMode === "PIX" && order.orderAccessVersion >= 1;
}
