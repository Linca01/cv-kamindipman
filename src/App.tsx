import React from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeHero } from './components/HomeHero';
import { PromoBanner } from './components/PromoBanner';
import { ProductCatalog } from './components/ProductCatalog';
import { OrderSection } from './components/OrderSection';
import { OrderTracking } from './components/OrderTracking';
import { AboutSection } from './components/AboutSection';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CustomerOrderHistory } from './components/CustomerOrderHistory';
import { CartDrawer } from './components/CartDrawer';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { InvoiceModal } from './components/InvoiceModal';
import { WhatsAppFloating } from './components/WhatsAppFloating';
import { MaterialEstimator } from './components/MaterialEstimator';
import { ProjectTipsSection } from './components/ProjectTipsSection';
import { MaterialGallery } from './components/MaterialGallery';
import { LanguageProvider } from './context/LanguageContext';
import { storageService } from './services/storageService';
import { Product, Order, CompanySettings, ShippingZone, CartItem } from './types';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<string>('beranda');
  const [products, setProducts] = React.useState<Product[]>([]);
  const [shippingZones, setShippingZones] = React.useState<ShippingZone[]>([]);
  const [settings, setSettings] = React.useState<CompanySettings>(storageService.getCompanySettings());
  
  // Search & Estimator Modal state
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [isEstimatorModalOpen, setIsEstimatorModalOpen] = React.useState<boolean>(false);
  const [preSelectedReviewOrderCode, setPreSelectedReviewOrderCode] = React.useState<string>('');

  // Cart state
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  // Pre-selected for ordering form
  const [selectedOrderProductId, setSelectedOrderProductId] = React.useState<string>('');
  const [selectedOrderRit, setSelectedOrderRit] = React.useState<number>(3);

  // Modals state
  const [activePaymentOrder, setActivePaymentOrder] = React.useState<Order | null>(null);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = React.useState<Order | null>(null);
  const [trackingOrderCode, setTrackingOrderCode] = React.useState<string>('');
  const [orderToast, setOrderToast] = React.useState<string | null>(null);

  const loadData = () => {
    setProducts(storageService.getProducts());
    setShippingZones(storageService.getShippingZones());
    setSettings(storageService.getCompanySettings());
  };

  React.useEffect(() => {
    loadData();
    const unsubscribe = storageService.subscribe(() => {
      loadData();
    });
    return unsubscribe;
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, rit: number) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx].rit += rit;
        return copy;
      }
      return [...prev, { product, rit }];
    });
  };

  const handleUpdateCartRit = (productId: string, newRit: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, rit: newRit } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckoutFromCart = () => {
    setIsCartOpen(false);
    if (cartItems.length > 0) {
      setSelectedOrderProductId(cartItems[0].product.id);
      setSelectedOrderRit(cartItems[0].rit);
    }
    setActiveTab('pemesanan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderNow = (product: Product, rit: number) => {
    setSelectedOrderProductId(product.id);
    setSelectedOrderRit(rit);
    setActiveTab('pemesanan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderCreatedSuccess = (order: Order) => {
    setTrackingOrderCode(order.orderCode);
    setOrderToast(`Pesanan berhasil dibuat! Kode: ${order.orderCode}`);
    setTimeout(() => setOrderToast(null), 5000);

    // If COD, switch to tracking so customer sees digital proof
    if (order.paymentMethod === 'cod') {
      setActiveTab('cek-pesanan');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePaymentSuccess = (updatedOrder: Order) => {
    setActivePaymentOrder(null);
    setActiveInvoiceOrder(updatedOrder);
    setTrackingOrderCode(updatedOrder.orderCode);
    setActiveTab('cek-pesanan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.rit, 0);

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-zinc-900 selection:bg-orange-500 selection:text-white">
        
        {/* Global Navigation Header with Search, Language Toggle, and Estimator */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cartCount={totalCartCount}
          openCart={() => setIsCartOpen(true)}
          settings={settings}
          isAdmin={storageService.isAdminLoggedIn()}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenEstimator={() => setIsEstimatorModalOpen(true)}
          products={products}
        />

        {/* Floating Order Success Toast */}
        {orderToast && (
          <div className="fixed top-24 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{orderToast}</span>
          </div>
        )}

        {/* Main Content Router */}
        <main className="flex-1">
          {activeTab === 'beranda' && (
            <>
              <PromoBanner
                onClaimPromo={(productId, rit, promoCode) => {
                  if (productId) setSelectedOrderProductId(productId);
                  if (rit) setSelectedOrderRit(rit);
                  setOrderToast(`Kupon ${promoCode} dipilih untuk ${rit} rit material.`);
                  setTimeout(() => setOrderToast(null), 4500);
                  setActiveTab('pemesanan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                adminWhatsApp={settings.adminWhatsApp}
              />

              <HomeHero
                onGoToOrder={(prodId) => {
                  if (prodId) setSelectedOrderProductId(prodId);
                  setActiveTab('pemesanan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onGoToProducts={() => {
                  setActiveTab('produk');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                settings={settings}
                products={products}
              />

              <ProductCatalog
                products={products}
                onOrderNow={handleOrderNow}
                onAddToCart={handleAddToCart}
                settings={settings}
                externalSearchQuery={searchQuery}
                onOpenGallery={() => {
                  document.getElementById('galeri-material')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              <MaterialGallery
                onGoToOrder={(prodId) => {
                  if (prodId) setSelectedOrderProductId(prodId);
                  setActiveTab('pemesanan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              <CustomerReviewsSection
                onGoToOrder={() => {
                  setActiveTab('pemesanan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onTrackOrder={(orderCode) => {
                  setTrackingOrderCode(orderCode);
                  setActiveTab('cek-pesanan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                preSelectedOrderCode={preSelectedReviewOrderCode}
              />

              <AboutSection
                settings={settings}
                onGoToOrder={() => {
                  setActiveTab('pemesanan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              <ProjectTipsSection
                onOpenEstimator={() => setIsEstimatorModalOpen(true)}
                onGoToOrder={() => {
                  setActiveTab('pemesanan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              <FAQSection
                settings={settings}
                onGoToOrder={() => {
                  setActiveTab('pemesanan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              <ContactSection settings={settings} />
            </>
          )}

          {activeTab === 'produk' && (
            <>
              <ProductCatalog
                products={products}
                onOrderNow={handleOrderNow}
                onAddToCart={handleAddToCart}
                settings={settings}
                externalSearchQuery={searchQuery}
              />
              <MaterialGallery
                onGoToOrder={(prodId) => {
                  if (prodId) setSelectedOrderProductId(prodId);
                  setActiveTab('pemesanan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </>
          )}

        {activeTab === 'pemesanan' && (
          <OrderSection
            products={products}
            shippingZones={shippingZones}
            settings={settings}
            preSelectedProductId={selectedOrderProductId}
            preSelectedRit={selectedOrderRit}
            onOrderSuccess={handleOrderCreatedSuccess}
            onOpenPaymentModal={(order) => setActivePaymentOrder(order)}
          />
        )}

        {activeTab === 'cek-pesanan' && (
          <OrderTracking
            initialOrderCode={trackingOrderCode}
            onOpenInvoice={(order) => setActiveInvoiceOrder(order)}
            adminWhatsApp={settings.adminWhatsApp}
            onWriteReview={(orderCode) => {
              setPreSelectedReviewOrderCode(orderCode);
              setActiveTab('beranda');
              setTimeout(() => {
                document.getElementById('ulasan-pelanggan')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          />
        )}

        {activeTab === 'riwayat-pesanan' && (
          <CustomerOrderHistory
            onOpenInvoice={(order) => setActiveInvoiceOrder(order)}
            onTrackOrder={(orderCode) => {
              setTrackingOrderCode(orderCode);
              setActiveTab('cek-pesanan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onReorder={(productId, rit) => {
              setSelectedOrderProductId(productId);
              setSelectedOrderRit(rit);
              setActiveTab('pemesanan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoToOrder={() => {
              setActiveTab('pemesanan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            adminWhatsApp={settings.adminWhatsApp}
            onWriteReview={(orderCode) => {
              setPreSelectedReviewOrderCode(orderCode);
              setActiveTab('beranda');
              setTimeout(() => {
                document.getElementById('ulasan-pelanggan')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          />
        )}

        {activeTab === 'tentang-kami' && (
          <>
            <AboutSection
              settings={settings}
              onGoToOrder={() => {
                setActiveTab('pemesanan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <MaterialGallery
              onGoToOrder={(prodId) => {
                if (prodId) setSelectedOrderProductId(prodId);
                setActiveTab('pemesanan');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}

        {activeTab === 'kontak' && (
          <ContactSection settings={settings} />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            onOpenInvoice={(order) => setActiveInvoiceOrder(order)}
            onExitAdmin={() => setActiveTab('beranda')}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateRit={handleUpdateCartRit}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckoutFromCart}
      />

      {/* Payment Gateway Modal (Midtrans/Xendit) */}
      {activePaymentOrder && (
        <PaymentGatewayModal
          order={activePaymentOrder}
          onClose={() => setActivePaymentOrder(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Printable Digital Invoice / Nota Modal */}
      {activeInvoiceOrder && (
        <InvoiceModal
          order={activeInvoiceOrder}
          onClose={() => setActiveInvoiceOrder(null)}
          settings={settings}
        />
      )}

      {/* Material Estimator Modal */}
      {isEstimatorModalOpen && (
        <MaterialEstimator
          products={products}
          onApplyEstimate={(prodId, rit) => {
            const prod = products.find((p) => p.id === prodId);
            if (prod) handleOrderNow(prod, rit);
            setIsEstimatorModalOpen(false);
          }}
          adminWhatsApp={settings.adminWhatsApp}
          onClose={() => setIsEstimatorModalOpen(false)}
          isModal={true}
        />
      )}

      {/* Floating WhatsApp Button */}
      <WhatsAppFloating settings={settings} />

      {/* Global Footer */}
      <Footer settings={settings} setActiveTab={setActiveTab} />
    </div>
  </LanguageProvider>
  );
}
