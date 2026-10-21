import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  ShoppingBag,
  Search,
  Eye,
  Truck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Package,
  CreditCard,
  MapPin,
  Phone,
  Calendar,
  ArrowUpDown,
  Printer,
  RefreshCw,
} from 'lucide-react';
import {
  CustomerOrder,
  INITIAL_MOCK_CUSTOMER_ORDERS,
  SERVICE_LABELS,
} from '@/lib/customerData';

const STATUS_STAGES = [
  'Order Placed',
  'Pickup Scheduled',
  'In Washing & Ironing',
  'Quality Inspection',
  'Out for Delivery',
  'Delivered',
] as const;

type OrderStatus = CustomerOrder['status'];

export default function CustomerOrders() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);

  // Load orders from localStorage (shared with customer store)
  const loadOrders = () => {
    const saved = localStorage.getItem('customerOrders');
    const loaded: CustomerOrder[] = saved
      ? JSON.parse(saved)
      : INITIAL_MOCK_CUSTOMER_ORDERS;
    setOrders(loaded);
  };

  useEffect(() => {
    loadOrders();
    // Poll for new orders every 5s (simulates real-time)
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.orderId === orderId ? { ...o, status: newStatus } : o
      );
      localStorage.setItem('customerOrders', JSON.stringify(updated));
      return updated;
    });
    if (selectedOrder?.orderId === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    const map: Record<string, { variant: string; icon: React.ReactNode }> = {
      'Order Placed': { variant: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: <Package className="w-3 h-3" /> },
      'Pickup Scheduled': { variant: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: <Clock className="w-3 h-3" /> },
      'In Washing & Ironing': { variant: 'bg-violet-500/10 text-violet-600 border-violet-500/20', icon: <RefreshCw className="w-3 h-3" /> },
      'Quality Inspection': { variant: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20', icon: <Eye className="w-3 h-3" /> },
      'Out for Delivery': { variant: 'bg-orange-500/10 text-orange-600 border-orange-500/20', icon: <Truck className="w-3 h-3" /> },
      'Delivered': { variant: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: <CheckCircle2 className="w-3 h-3" /> },
    };
    const s = map[status] || map['Order Placed'];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.variant}`}>
        {s.icon}
        {status}
      </span>
    );
  };

  const getStageIndex = (status: string) => {
    const idx = STATUS_STAGES.indexOf(status as any);
    return idx >= 0 ? idx : 0;
  };

  const stats = {
    total: orders.length,
    placed: orders.filter((o) => o.status === 'Order Placed').length,
    inProgress: orders.filter((o) =>
      ['Pickup Scheduled', 'In Washing & Ironing', 'Quality Inspection'].includes(o.status)
    ).length,
    outForDelivery: orders.filter((o) => o.status === 'Out for Delivery').length,
    delivered: orders.filter((o) => o.status === 'Delivered').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Customer Orders"
        description="View, manage and track all ordinary laundry orders from customer store"
      />

      <main className="p-6 space-y-6 animate-fade-in">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="dashboard-card">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Orders</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10">
                <Package className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">New / Placed</p>
                <p className="text-xl font-bold">{stats.placed}</p>
              </div>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-500/10">
                <RefreshCw className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">In Progress</p>
                <p className="text-xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10">
                <Truck className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Out for Delivery</p>
                <p className="text-xl font-bold">{stats.outForDelivery}</p>
              </div>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Delivered</p>
                <p className="text-xl font-bold">{stats.delivered}</p>
              </div>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10">
                <CreditCard className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Revenue (BDT)</p>
                <p className="text-xl font-bold">৳{stats.totalRevenue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, customer name, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-52 bg-card">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Order Placed">Order Placed</SelectItem>
                <SelectItem value="Pickup Scheduled">Pickup Scheduled</SelectItem>
                <SelectItem value="In Washing & Ironing">In Washing & Ironing</SelectItem>
                <SelectItem value="Quality Inspection">Quality Inspection</SelectItem>
                <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={loadOrders} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Orders Table */}
        <div className="data-table">
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead className="pl-6">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Pickup</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total (BDT)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.orderId} className="table-row">
                  <TableCell className="pl-6">
                    <span className="font-bold text-primary">{order.orderId}</span>
                    <p className="text-[11px] text-muted-foreground">{order.createdAt}</p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} pcs
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <p className="font-medium">{order.pickupDate}</p>
                      <p className="text-muted-foreground">{order.pickupTimeSlot}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold">{order.paymentMethod}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-sm">৳{order.totalAmount}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 space-y-2">
            <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto opacity-40" />
            <p className="text-muted-foreground font-medium">No customer orders found.</p>
            <p className="text-xs text-muted-foreground">
              Orders placed from the Customer Store (/customer) will appear here.
            </p>
          </div>
        )}
      </main>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Order {selectedOrder.orderId}
                </DialogTitle>
                <DialogDescription>
                  Placed on {selectedOrder.createdAt} by {selectedOrder.customerName}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 mt-2">
                {/* Status Pipeline */}
                <div className="p-4 rounded-xl bg-muted/40 border border-border">
                  <h4 className="text-xs font-semibold text-muted-foreground mb-4 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> ORDER STATUS PIPELINE
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {STATUS_STAGES.map((stage, idx) => {
                      const currentIdx = getStageIndex(selectedOrder.status);
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={stage} className="flex flex-col items-center text-center gap-1.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCurrent
                                ? 'bg-primary text-white ring-4 ring-primary/20 scale-110'
                                : isCompleted
                                ? 'bg-emerald-500 text-white'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span className={`text-[10px] leading-tight ${isCurrent ? 'font-bold text-primary' : isCompleted ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Update Status Row */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                    Update Status:
                  </span>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(val) =>
                      handleStatusChange(selectedOrder.orderId, val as OrderStatus)
                    }
                  >
                    <SelectTrigger className="flex-1 h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {STATUS_STAGES.map((stage) => (
                        <SelectItem key={stage} value={stage} className="text-xs">
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Customer & Pickup Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-card space-y-3 text-xs">
                    <h4 className="font-bold text-sm text-foreground border-b border-border pb-2">
                      Customer Details
                    </h4>
                    <div className="space-y-2 text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{selectedOrder.customerName}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-primary" /> {selectedOrder.phone}
                      </p>
                      <p className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                        {selectedOrder.address}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card space-y-3 text-xs">
                    <h4 className="font-bold text-sm text-foreground border-b border-border pb-2">
                      Pickup & Payment
                    </h4>
                    <div className="space-y-2 text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {selectedOrder.pickupDate} ({selectedOrder.pickupTimeSlot})
                      </p>
                      <p className="flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                        {selectedOrder.paymentMethod}
                      </p>
                      <p className="flex items-center gap-2 font-bold text-foreground text-sm">
                        Total: <span className="text-primary">৳{selectedOrder.totalAmount} BDT</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Itemized Bill */}
                <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h4 className="font-bold text-sm text-foreground">Itemized Bill</h4>
                    <Button variant="ghost" size="sm" onClick={() => window.print()} className="h-7 text-xs gap-1">
                      <Printer className="w-3 h-3" /> Print
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {selectedOrder.items.map((cartItem, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-2 border-b border-border/50 last:border-0"
                      >
                        <div>
                          <p className="font-semibold text-foreground">{cartItem.item.name}</p>
                          <p className="text-muted-foreground">
                            {SERVICE_LABELS[cartItem.serviceType]} × {cartItem.quantity}
                          </p>
                        </div>
                        <span className="font-bold">৳{cartItem.totalPrice}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 space-y-1 text-xs border-t border-border">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal:</span>
                      <span className="font-semibold">৳{selectedOrder.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery:</span>
                      {selectedOrder.deliveryFee === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        <span className="font-semibold">৳{selectedOrder.deliveryFee}</span>
                      )}
                    </div>
                    <div className="flex justify-between font-bold text-sm text-foreground pt-1 border-t border-border">
                      <span>Grand Total:</span>
                      <span className="text-primary text-base">৳{selectedOrder.totalAmount} BDT</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
