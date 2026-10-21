import { useState } from 'react';
import { X, Calendar, Clock, MapPin, CreditCard, CheckCircle, ShieldCheck, Truck, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CartItem, CustomerUser, CustomerOrder } from '@/lib/customerData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentUser: CustomerUser;
  onOrderConfirmed: (newOrder: CustomerOrder) => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  currentUser,
  onOrderConfirmed,
}: CheckoutModalProps) {
  const [pickupDate, setPickupDate] = useState('2026-07-27');
  const [pickupTimeSlot, setPickupTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [address, setAddress] = useState(currentUser.address || 'House 14, Road 7, Block D, Mirpur 11, Dhaka');
  const [phone, setPhone] = useState(currentUser.phone || '+880 1712-345678');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Cash on Delivery' | 'Card'>('bKash');

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = subtotal >= 500 ? 0 : 60;
  const grandTotal = subtotal + deliveryFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const generatedOrderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);

      const newOrder: CustomerOrder = {
        orderId: generatedOrderId,
        customerName: currentUser.name,
        phone: phone,
        email: currentUser.email,
        address: address,
        pickupDate: pickupDate,
        pickupTimeSlot: pickupTimeSlot,
        paymentMethod: paymentMethod,
        items: cartItems,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        discount: 0,
        totalAmount: grandTotal,
        status: 'Order Placed',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };

      onOrderConfirmed(newOrder);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl p-6 relative">
          
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4 rounded-full">
            <X className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Schedule Pickup & Payment</h2>
              <p className="text-xs text-muted-foreground">Order total: <strong className="text-primary font-bold">৳{grandTotal} BDT</strong></p>
            </div>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-5 text-left">
            
            {/* Pickup Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="pickup-date" className="flex items-center gap-1.5 text-xs font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> Pickup Date
                </Label>
                <Input
                  id="pickup-date"
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="h-10 text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pickup-slot" className="flex items-center gap-1.5 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Time Slot
                </Label>
                <select
                  id="pickup-slot"
                  value={pickupTimeSlot}
                  onChange={(e) => setPickupTimeSlot(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="09:00 AM - 11:00 AM">Morning (09:00 AM - 11:00 AM)</option>
                  <option value="11:00 AM - 01:00 PM">Noon (11:00 AM - 01:00 PM)</option>
                  <option value="02:00 PM - 04:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                  <option value="06:00 PM - 08:00 PM">Evening (06:00 PM - 08:00 PM)</option>
                </select>
              </div>
            </div>

            {/* Delivery Address & Contact */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="checkout-address" className="flex items-center gap-1.5 text-xs font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> Pickup & Delivery Address (Dhaka / Sylhet)
                </Label>
                <Input
                  id="checkout-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House #, Road #, Area, Landmark"
                  className="h-10 text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="checkout-phone" className="text-xs font-semibold">Contact Phone Number</Label>
                <Input
                  id="checkout-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 text-sm"
                  required
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2 border-t border-border">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-primary" /> Payment Method (BDT)
              </Label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'bKash', label: 'bKash', badge: 'Popular', color: 'border-pink-500 bg-pink-500/5 text-pink-600' },
                  { id: 'Nagad', label: 'Nagad', badge: 'Instant', color: 'border-orange-500 bg-orange-500/5 text-orange-600' },
                  { id: 'Cash on Delivery', label: 'Cash / COD', badge: 'Standard', color: 'border-emerald-500 bg-emerald-500/5 text-emerald-600' },
                  { id: 'Card', label: 'Visa / Card', badge: 'Online', color: 'border-blue-500 bg-blue-500/5 text-blue-600' },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === method.id
                        ? `${method.color} font-bold shadow-xs ring-2 ring-primary/20`
                        : 'border-border bg-card text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="text-xs font-semibold">{method.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted font-normal">{method.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold">৳{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Pickup & Delivery Charge:</span>
                {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : <span className="font-semibold">৳{deliveryFee}</span>}
              </div>
              <div className="pt-2 border-t border-border flex justify-between font-bold text-sm text-foreground">
                <span>Total Amount to Pay:</span>
                <span className="text-primary text-base">৳{grandTotal} BDT</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-sm font-bold flex items-center justify-center gap-2 shadow-md"
            >
              {isLoading ? 'Creating Laundry Order...' : `Confirm Order (৳${grandTotal} BDT)`}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
}
