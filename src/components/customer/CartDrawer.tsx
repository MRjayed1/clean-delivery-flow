import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem, SERVICE_LABELS } from '@/lib/customerData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 60;
  const grandTotal = subtotal + deliveryFee;
  const freeDeliveryShortfall = 500 - subtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-background border-l border-border shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Your Laundry Cart</h2>
                <p className="text-xs text-muted-foreground">{cartItems.length} item(s) selected</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Free Delivery Banner */}
          {subtotal > 0 && (
            <div className="px-5 py-2.5 bg-primary/5 border-b border-primary/10 flex items-center gap-2 text-xs">
              <Truck className="w-4 h-4 text-primary flex-shrink-0" />
              {subtotal >= 500 ? (
                <span className="text-primary font-semibold">🎉 You unlocked FREE Home Pickup & Delivery!</span>
              ) : (
                <span className="text-muted-foreground">
                  Add <strong className="text-primary">৳{freeDeliveryShortfall}</strong> more for <strong className="text-primary">FREE Delivery</strong>
                </span>
              )}
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-foreground">Cart is Empty</h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Browse our Men's, Women's, and Children's clothing categories to select washing or ironing services.
                </p>
              </div>
            ) : (
              cartItems.map((cartItem) => (
                <div
                  key={cartItem.cartItemId}
                  className="p-4 rounded-xl border border-border bg-card shadow-xs flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">{cartItem.item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          {cartItem.item.genderLabel}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          {SERVICE_LABELS[cartItem.serviceType]}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(cartItem.cartItemId)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1 bg-muted/60 rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-md"
                        onClick={() => onUpdateQuantity(cartItem.cartItemId, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-7 text-center font-semibold text-sm">{cartItem.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-md"
                        onClick={() => onUpdateQuantity(cartItem.cartItemId, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Price calculation */}
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground block">৳{cartItem.unitPrice} / item</span>
                      <span className="text-sm font-bold text-primary">৳{cartItem.totalPrice}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Bill Breakdown */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-border bg-card space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Home Pickup & Delivery</span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase text-[11px]">FREE</span>
                  ) : (
                    <span className="font-semibold text-foreground">৳{deliveryFee}</span>
                  )}
                </div>
                <div className="pt-2 border-t border-border flex justify-between text-sm font-bold text-foreground">
                  <span>Grand Total (BDT)</span>
                  <span className="text-lg text-primary">৳{grandTotal}</span>
                </div>
              </div>

              <Button
                onClick={onProceedToCheckout}
                className="w-full h-12 text-sm font-semibold flex items-center justify-center gap-2 shadow-md"
              >
                <span>Proceed to Order & Pay</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
