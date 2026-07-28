import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shirt,
  Sparkles,
  Search,
  ShoppingCart,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck,
  Heart,
  Plus,
  Minus,
  ArrowRight,
  User,
  BadgePercent,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomerNavbar } from '@/components/customer/CustomerNavbar';
import { CartDrawer } from '@/components/customer/CartDrawer';
import { CustomerAuthModal } from '@/components/customer/CustomerAuthModal';
import { CheckoutModal } from '@/components/customer/CheckoutModal';
import {
  LAUNDRY_CATALOG,
  ClothingItem,
  ServiceType,
  CartItem,
  CustomerUser,
  CustomerOrder,
  SERVICE_LABELS,
  INITIAL_MOCK_CUSTOMER_ORDERS,
} from '@/lib/customerData';

export default function CustomerServices() {
  const navigate = useNavigate();

  // State Management
  const [activeCategory, setActiveCategory] = useState<'all' | 'men' | 'women' | 'children' | 'household'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected service per item ID
  const [itemServices, setItemServices] = useState<Record<string, ServiceType>>({});
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Auth State
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem('currentCustomer');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Notification Banner
  const [notificationMsg, setNotificationMsg] = useState('');

  // Initial service mapping default
  useEffect(() => {
    const defaults: Record<string, ServiceType> = {};
    LAUNDRY_CATALOG.forEach((item) => {
      defaults[item.id] = 'wash_iron';
    });
    setItemServices(defaults);
  }, []);

  const handleServiceChange = (itemId: string, service: ServiceType) => {
    setItemServices((prev) => ({ ...prev, [itemId]: service }));
  };

  const handleAddToCart = (item: ClothingItem) => {
    const selectedService = itemServices[item.id] || 'wash_iron';
    const unitPrice = item.basePrices[selectedService] || item.basePrices.wash_iron;
    const cartItemId = `${item.id}-${selectedService}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((ci) => ci.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + 1;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: newQty * unitPrice,
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            item,
            serviceType: selectedService,
            quantity: 1,
            unitPrice,
            totalPrice: unitPrice,
          },
        ];
      }
    });

    setNotificationMsg(`Added ${item.name} (${SERVICE_LABELS[selectedService]}) to cart!`);
    setTimeout(() => setNotificationMsg(''), 3000);
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.cartItemId === cartItemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0
              ? { ...ci, quantity: newQty, totalPrice: newQty * ci.unitPrice }
              : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    if (!currentUser) {
      setIsAuthModalOpen(true);
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const handleAuthSuccess = (user: CustomerUser) => {
    setCurrentUser(user);
    // If cart has items, trigger checkout
    if (cart.length > 0) {
      setIsCheckoutOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentCustomer');
    setCurrentUser(null);
  };

  const handleOrderConfirmed = (newOrder: CustomerOrder) => {
    // Save order to history
    const saved = localStorage.getItem('customerOrders');
    const existingOrders: CustomerOrder[] = saved ? JSON.parse(saved) : INITIAL_MOCK_CUSTOMER_ORDERS;
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem('customerOrders', JSON.stringify(updatedOrders));

    // Clear cart & redirect to track order page
    setCart([]);
    navigate(`/track-order?id=${newOrder.orderId}`);
  };

  // Filter Catalog
  const filteredCatalog = LAUNDRY_CATALOG.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      
      {/* Top Navbar */}
      <CustomerNavbar
        cartCount={cartTotalItems}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Notification toast banner */}
      {notificationMsg && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-2 px-4 text-center sticky top-16 z-30 shadow-md animate-fade-in flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Hero Service Banner */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-blue-500/10 border-b border-border py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Premium Everyday Laundry
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Crisp Wash, Steam Iron & Dry Cleaning for Your Family
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Order laundry for Men's, Women's, and Children's everyday clothing in BDT (৳). Fast doorstep pickup and 24–48 hour delivery across Bangladesh.
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-primary" />
                <span>Free Delivery over ৳500</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>24-48h Express Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Fabric Safety Guarantee</span>
              </div>
            </div>
          </div>

          {/* Quick Order Stats / Card */}
          <div className="w-full md:w-auto bg-card border border-border rounded-2xl p-6 shadow-xl flex flex-col gap-4 min-w-[280px]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Standard Pricing</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold">BDT Rates</span>
            </div>
            <div className="space-y-2 border-y border-border py-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shirts & Tops (Ironing):</span>
                <span className="font-bold text-foreground">From ৳15 - ৳20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shirts & Pants (Wash+Iron):</span>
                <span className="font-bold text-foreground">From ৳50 - ৳60</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saree & Suits (Dry Clean):</span>
                <span className="font-bold text-foreground">From ৳120 - ৳350</span>
              </div>
            </div>
            <Button onClick={() => setIsCartOpen(true)} className="w-full h-10 text-xs font-bold gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span>View Cart ({cartTotalItems})</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Category Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border pb-6">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'men', label: "Men's Wear" },
              { id: 'women', label: "Women's Wear" },
              { id: 'children', label: "Children's Wear" },
              { id: 'household', label: 'Household Linens' },
            ].map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(cat.id as any)}
                className="rounded-full text-xs font-semibold"
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search shirts, saree, suit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs rounded-full bg-muted/30"
            />
          </div>
        </div>

        {/* Catalog Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCatalog.map((item) => {
            const selectedService = itemServices[item.id] || 'wash_iron';
            const currentPrice = item.basePrices[selectedService] || item.basePrices.wash_iron;

            return (
              <div
                key={item.id}
                className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-primary/50 transition-all duration-300 flex flex-col justify-between group relative"
              >
                {item.popular && (
                  <span className="absolute top-4 right-4 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold uppercase tracking-wider">
                    Popular
                  </span>
                )}

                <div>
                  {/* Category Badge */}
                  <span className="text-[11px] font-semibold text-primary/80 uppercase tracking-wide">
                    {item.genderLabel}
                  </span>

                  <h3 className="text-base font-bold text-foreground mt-1 group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Service Type Selection Dropdown */}
                  <div className="mt-4 space-y-1.5">
                    <label className="text-[11px] font-medium text-muted-foreground block">
                      Choose Service:
                    </label>
                    <select
                      value={selectedService}
                      onChange={(e) => handleServiceChange(item.id, e.target.value as ServiceType)}
                      className="w-full h-9 px-3 text-xs rounded-lg border border-input bg-background font-semibold text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="wash_iron">Wash & Iron (৳{item.basePrices.wash_iron})</option>
                      <option value="wash_fold">Wash & Fold (৳{item.basePrices.wash_fold})</option>
                      <option value="iron_only">Iron Only (৳{item.basePrices.iron_only})</option>
                      {item.basePrices.dry_clean && (
                        <option value="dry_clean">Dry Cleaning (৳{item.basePrices.dry_clean})</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Price & Add to Cart Footer */}
                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Price (BDT)</span>
                    <span className="text-lg font-extrabold text-primary">৳{currentPrice}</span>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-4 h-9 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </Button>
                </div>

              </div>
            );
          })}
        </div>

        {filteredCatalog.length === 0 && (
          <div className="py-16 text-center text-muted-foreground space-y-2">
            <Search className="w-10 h-10 mx-auto opacity-40" />
            <p className="text-base font-medium">No clothes found matching your filter.</p>
            <p className="text-xs">Try clearing your search query or selecting another category.</p>
          </div>
        )}

      </main>

      {/* Floating View Cart Banner (Mobile/Desktop overlay when cart has items) */}
      {cartTotalItems > 0 && (
        <div className="sticky bottom-4 z-30 max-w-lg mx-auto w-full px-4">
          <div className="bg-primary text-primary-foreground p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-primary/20 backdrop-blur-md animate-bounce-short">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                {cartTotalItems}
              </div>
              <div className="text-left">
                <p className="text-xs opacity-90">Items in Cart</p>
                <p className="text-sm font-extrabold">
                  Total: ৳{cart.reduce((sum, item) => sum + item.totalPrice, 0)} BDT
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCartOpen(true)}
              className="font-bold gap-1 text-xs px-4"
            >
              <span>View Cart & Pay</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Cart Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Auth Verification Modal */}
      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessAuth={handleAuthSuccess}
      />

      {/* Checkout Modal */}
      {currentUser && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={cart}
          currentUser={currentUser}
          onOrderConfirmed={handleOrderConfirmed}
        />
      )}

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border mt-16 py-8 px-4 text-center text-xs text-muted-foreground space-y-2">
        <p className="font-semibold text-foreground">EasyLaundry Customer Ordinary Services Portal</p>
        <p>© 2025 LaundryOps. All prices listed in Bangladeshi Taka (BDT ৳).</p>
      </footer>

    </div>
  );
}
