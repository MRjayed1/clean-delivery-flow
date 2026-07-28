import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  Shirt,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  ArrowLeft,
  Sparkles,
  Printer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomerNavbar } from '@/components/customer/CustomerNavbar';
import { CustomerOrder, INITIAL_MOCK_CUSTOMER_ORDERS, SERVICE_LABELS } from '@/lib/customerData';

const STATUS_STAGES = [
  'Order Placed',
  'Pickup Scheduled',
  'In Washing & Ironing',
  'Quality Inspection',
  'Out for Delivery',
  'Delivered',
];

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQueryId = searchParams.get('id') || 'ORD-93021';

  const [searchId, setSearchId] = useState(initialQueryId);
  const [currentOrder, setCurrentOrder] = useState<CustomerOrder | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Load orders from localStorage or initial mock
  useEffect(() => {
    const saved = localStorage.getItem('customerOrders');
    const allOrders: CustomerOrder[] = saved ? JSON.parse(saved) : INITIAL_MOCK_CUSTOMER_ORDERS;

    const match = allOrders.find(
      (o) => o.orderId.toLowerCase() === searchId.trim().toLowerCase()
    );

    if (match) {
      setCurrentOrder(match);
      setNotFound(false);
    } else if (searchId) {
      // Fall back to first mock order if initial load or show not found
      if (allOrders.length > 0) {
        setCurrentOrder(allOrders[0]);
      } else {
        setNotFound(true);
      }
    }
  }, [searchId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = localStorage.getItem('customerOrders');
    const allOrders: CustomerOrder[] = saved ? JSON.parse(saved) : INITIAL_MOCK_CUSTOMER_ORDERS;

    const match = allOrders.find(
      (o) => o.orderId.toLowerCase() === searchId.trim().toLowerCase()
    );

    if (match) {
      setCurrentOrder(match);
      setNotFound(false);
    } else {
      setNotFound(true);
    }
  };

  const getStageIndex = (status: string) => {
    const idx = STATUS_STAGES.indexOf(status);
    return idx >= 0 ? idx : 2;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <CustomerNavbar
        cartCount={0}
        onOpenCart={() => navigate('/customer')}
        currentUser={null}
        onOpenAuthModal={() => {}}
        onLogout={() => {}}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Navigation & Title */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/customer')} className="gap-2 text-xs">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Services Catalog</span>
          </Button>

          <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 font-semibold flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" /> Customer Order Tracker
          </span>
        </div>

        {/* Search Order Bar */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
              <Input
                placeholder="Enter Order ID (e.g. ORD-93021)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="pl-10 h-11 text-sm font-semibold rounded-xl"
              />
            </div>
            <Button type="submit" className="h-11 px-6 font-semibold text-xs w-full sm:w-auto">
              Track Order
            </Button>
          </form>
        </div>

        {/* Order Details & Timeline */}
        {currentOrder && !notFound && (
          <div className="space-y-6">
            
            {/* Header info card */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-foreground">Order #{currentOrder.orderId}</h2>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">
                    {currentOrder.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Placed on {currentOrder.createdAt} | Customer: <strong>{currentOrder.customerName}</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-muted-foreground block">Total Amount Paid / COD</span>
                <span className="text-2xl font-extrabold text-primary">৳{currentOrder.totalAmount} BDT</span>
              </div>
            </div>

            {/* Visual Timeline Bar */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Live Processing Timeline
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {STATUS_STAGES.map((stage, idx) => {
                  const currentIdx = getStageIndex(currentOrder.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={stage} className="flex flex-col items-center text-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isCurrent
                            ? 'bg-primary text-primary-foreground font-bold ring-4 ring-primary/20 scale-110'
                            : isCompleted
                            ? 'bg-emerald-500 text-white font-semibold'
                            : 'bg-muted text-muted-foreground opacity-60'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span
                        className={`text-xs ${
                          isCurrent
                            ? 'font-bold text-primary'
                            : isCompleted
                            ? 'font-semibold text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Itemized Order Receipt & Schedule Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Pickup & Payment Details */}
              <div className="md:col-span-1 bg-card border border-border rounded-2xl p-5 space-y-4 text-xs">
                <h4 className="font-bold text-sm text-foreground border-b border-border pb-2">Order Information</h4>
                
                <div className="space-y-3 text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground block mb-0.5">Pickup Date & Slot:</span>
                    <p className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" /> {currentOrder.pickupDate} ({currentOrder.pickupTimeSlot})
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-foreground block mb-0.5">Delivery Address:</span>
                    <p className="flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" /> {currentOrder.address}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-foreground block mb-0.5">Payment Method:</span>
                    <p className="flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> {currentOrder.paymentMethod} (BDT ৳)
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-foreground block mb-0.5">Customer Contact:</span>
                    <p>{currentOrder.phone}</p>
                  </div>
                </div>
              </div>

              {/* Itemized Bill Receipt */}
              <div className="md:col-span-2 bg-card border border-border rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h4 className="font-bold text-sm text-foreground">Itemized Receipt</h4>
                  <Button variant="outline" size="sm" onClick={() => window.print()} className="h-8 text-xs gap-1.5">
                    <Printer className="w-3.5 h-3.5" /> Print Invoice
                  </Button>
                </div>

                <div className="space-y-3">
                  {currentOrder.items.map((cartItem, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-border/50">
                      <div>
                        <span className="font-semibold text-foreground text-sm">{cartItem.item.name}</span>
                        <div className="flex items-center gap-2 text-muted-foreground mt-0.5">
                          <span>{SERVICE_LABELS[cartItem.serviceType]}</span>
                          <span>•</span>
                          <span>Qty: {cartItem.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-foreground">৳{cartItem.totalPrice} BDT</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 space-y-1.5 text-xs text-right border-t border-border">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal:</span>
                    <span className="font-semibold">৳{currentOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Pickup & Delivery:</span>
                    {currentOrder.deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : <span className="font-semibold">৳{currentOrder.deliveryFee}</span>}
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-foreground pt-1 border-t border-border">
                    <span>Total Bill (BDT):</span>
                    <span className="text-primary text-base">৳{currentOrder.totalAmount} BDT</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {notFound && (
          <div className="p-12 text-center bg-card border border-border rounded-2xl space-y-3">
            <Search className="w-12 h-12 text-muted-foreground mx-auto opacity-40" />
            <h3 className="text-base font-bold text-foreground">Order Not Found</h3>
            <p className="text-xs text-muted-foreground">No laundry order found with ID "{searchId}". Please check your order reference number.</p>
          </div>
        )}

      </main>
    </div>
  );
}
