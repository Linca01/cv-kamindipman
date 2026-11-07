import React from 'react';
import { 
  ShieldCheck, 
  DollarSign, 
  Package, 
  Truck, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  FileText, 
  RefreshCw,
  Phone,
  BarChart3,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  Bell,
  Volume2,
  VolumeX,
  Mail,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Clock,
  X
} from 'lucide-react';
import { Product, Order, CompanySettings, ShippingZone, OrderStatus, PaymentStatus } from '../../types';
import { formatRupiah } from '../../utils/orderCalculator';
import { storageService } from '../../services/storageService';
import { ORDER_STATUS_LABELS } from '../OrderTracking';
import { OrderNotificationToast, ToastNotificationItem } from './OrderNotificationToast';

interface AdminDashboardProps {
  onOpenInvoice: (order: Order) => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenInvoice,
  onExitAdmin,
}) => {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = React.useState(storageService.isAdminLoggedIn());
  const [usernameInput, setUsernameInput] = React.useState('admin');
  const [passwordInput, setPasswordInput] = React.useState('');
  const [loginError, setLoginError] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);

  // Real-Time Notification & Alert State
  const [toasts, setToasts] = React.useState<ToastNotificationItem[]>([]);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = React.useState(false);
  const [highlightedOrderId, setHighlightedOrderId] = React.useState<string | null>(null);
  const knownOrderIdsRef = React.useRef<Set<string>>(new Set());

  const [desktopNotificationEnabled, setDesktopNotificationEnabled] = React.useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  // Dashboard Tab State
  const [activeAdminTab, setActiveAdminTab] = React.useState<'overview' | 'orders' | 'products' | 'shipping' | 'newsletter' | 'settings'>('overview');

  // Data State
  const [products, setProducts] = React.useState<Product[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [settings, setSettings] = React.useState<CompanySettings>(storageService.getCompanySettings());
  const [zones, setZones] = React.useState<ShippingZone[]>([]);
  const [orderFilterStatus, setOrderFilterStatus] = React.useState<string>('all');
  const [searchOrderQuery, setSearchOrderQuery] = React.useState('');

  // Editing Product State
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = React.useState(false);
  const [newProductForm, setNewProductForm] = React.useState({
    name: '',
    category: 'pasir' as const,
    shortDescription: '',
    fullDescription: '',
    pricePerRit: 1200000,
    available: true,
    stockRitEstimated: 100,
    unit: 'Rit Dump Truck (± 4-5 m³)',
    imageUrl: '/src/assets/images/product_pasir_1794022010015.jpg',
    useCases: 'Pasir cor beton, Pasir plester halus, Pasir konstruksi',
    origin: 'Quarry Wangar Makmur, Nabire Barat',
  });

  // Settings form state
  const [tempWhatsApp, setTempWhatsApp] = React.useState('');
  const [tempAlternatePhone, setTempAlternatePhone] = React.useState('');
  const [tempOperationalHours, setTempOperationalHours] = React.useState('');
  const [tempQuarryLocation, setTempQuarryLocation] = React.useState('');
  const [settingsSaveNotice, setSettingsSaveNotice] = React.useState(false);

  const loadData = React.useCallback(() => {
    const currentOrders = storageService.getOrders();
    setProducts(storageService.getProducts());
    setOrders(currentOrders);
    const currentSettings = storageService.getCompanySettings();
    setSettings(currentSettings);
    setTempWhatsApp(currentSettings.adminWhatsApp);
    setTempAlternatePhone(currentSettings.alternatePhone);
    setTempOperationalHours(currentSettings.operationalHours);
    setTempQuarryLocation(currentSettings.quarryLocation);
    setZones(storageService.getShippingZones());
    
    // Update known order IDs
    currentOrders.forEach((o) => knownOrderIdsRef.current.add(o.id));
  }, []);

  const playChimeSound = React.useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24); // G5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Ignore autoplay restriction or environment limitation
    }
  }, [soundEnabled]);

  // Trigger On-Screen Toast Notification
  const triggerOrderToast = React.useCallback((order: Order) => {
    playChimeSound();
    const newToast: ToastNotificationItem = {
      id: `toast_${order.id}_${Date.now()}`,
      order,
      receivedAt: new Date(),
      progress: 100,
      isPaused: false,
    };

    setToasts((prev) => [newToast, ...prev.filter((t) => t.order.id !== order.id).slice(0, 2)]);

    // Browser native desktop notification
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        const totalRit = order.items.reduce((acc, i) => acc + i.rit, 0);
        new Notification(`🚨 Pesanan Baru Masuk! (${order.orderCode})`, {
          body: `${order.customerName} memesan ${totalRit} Rit - ${formatRupiah(order.totalAmount)} (${order.deliveryDistrict})`,
          icon: '/src/assets/images/product_pasir_1794022010015.jpg',
        });
      } catch {}
    }
  }, [playChimeSound]);

  const handleDismissToast = React.useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  const handlePauseToast = React.useCallback((toastId: string, isPaused: boolean) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === toastId ? { ...t, isPaused } : t))
    );
  }, []);

  // Auto-dismiss countdown ticker (10s with pause-on-hover)
  React.useEffect(() => {
    if (toasts.length === 0) return;
    const interval = setInterval(() => {
      setToasts((prev) => {
        return prev
          .map((t) => {
            if (t.isPaused) return t;
            return { ...t, progress: Math.max(0, t.progress - 1) }; // decrements 1% every 100ms = 10s
          })
          .filter((t) => t.progress > 0);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [toasts.length]);

  // Real-time synchronization: Custom Event, Cross-Tab Storage, and Heartbeat Polling
  React.useEffect(() => {
    loadData();

    // Storage subscription for in-tab updates
    const unsubscribe = storageService.subscribe(() => {
      loadData();
    });

    // Custom event dispatched when order is created in this window
    const handleNewOrderAlert = (e: Event) => {
      const custom = e as CustomEvent;
      const order = custom.detail?.order as Order;
      if (order) {
        knownOrderIdsRef.current.add(order.id);
        triggerOrderToast(order);
        loadData();
      }
    };

    // Cross-tab storage detection & 3-second heartbeat polling
    const checkForIncomingOrders = () => {
      const currentOrders = storageService.getOrders();
      // Find orders that are not in knownOrderIdsRef
      const brandNewOrders = currentOrders.filter((o) => !knownOrderIdsRef.current.has(o.id));
      if (brandNewOrders.length > 0) {
        brandNewOrders.forEach((newOrder) => {
          knownOrderIdsRef.current.add(newOrder.id);
          triggerOrderToast(newOrder);
        });
        loadData();
      }
    };

    window.addEventListener('kmd_new_order_alert', handleNewOrderAlert);
    window.addEventListener('storage', checkForIncomingOrders);

    // Heartbeat check every 3 seconds for background / multi-tab order detection
    const heartbeatTimer = setInterval(checkForIncomingOrders, 3000);

    return () => {
      unsubscribe();
      window.removeEventListener('kmd_new_order_alert', handleNewOrderAlert);
      window.removeEventListener('storage', checkForIncomingOrders);
      clearInterval(heartbeatTimer);
    };
  }, [loadData, triggerOrderToast]);

  const handleRequestDesktopNotification = async () => {
    if (typeof Notification === 'undefined') {
      alert('Peramban Anda belum mendukung API Notifikasi Desktop.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setDesktopNotificationEnabled(true);
        new Notification('CV KAMINDIPMAN Admin', {
          body: 'Notifikasi pesanan real-time berhasil diaktifkan!',
        });
      }
    } catch {}
  };

  const handleSimulateNewOrder = () => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const names = [
      'Bpk. Lukas Pigai (Jl. Sam Ratulangi)',
      'Ir. Robertus Douw (Proyek Ruko Oyehe)',
      'Ibu Maria Waine (Kalisusu)',
      'CV Papua Mandiri Konstruksi',
      'Kontraktor Wangar Makmur'
    ];
    const selectedName = names[Math.floor(Math.random() * names.length)];
    const districts = ['Nabire Kota', 'Nabire Barat', 'Makimi', 'Teluk Kimi'];
    const selectedDistrict = districts[Math.floor(Math.random() * districts.length)];
    const ritCount = Math.floor(2 + Math.random() * 6); // 2 to 7 rit

    const created = storageService.createOrder({
      customerName: `${selectedName} [Uji #${randomCode}]`,
      customerPhone: '082137238800',
      customerEmail: 'admin.cvkamindipman@gmail.com',
      deliveryMethod: 'delivery',
      deliveryAddress: `Jl. Poros Utama No. ${Math.floor(1 + Math.random() * 80)}, Nabire`,
      deliveryDistrict: selectedDistrict,
      deliveryNotes: 'Harap dump truck tiba sebelum pukul 15.00 WIT untuk pengecoran.',
      items: [{ productId: products[0]?.id || 'prod_pasir_01', rit: ritCount }],
      paymentMethod: 'cod',
    });

    if (created) {
      knownOrderIdsRef.current.add(created.id);
      triggerOrderToast(created);
    }
  };

  const handleViewOrderFromNotification = (order: Order) => {
    setActiveAdminTab('orders');
    setSearchOrderQuery(order.orderCode);
    setHighlightedOrderId(order.id);
    setIsNotifDropdownOpen(false);

    // Smooth scroll to order row
    setTimeout(() => {
      const el = document.getElementById(`order-row-${order.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);

    // Fade out glow highlight after 6 seconds
    setTimeout(() => {
      setHighlightedOrderId(null);
    }, 6000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setLoginError('');

    const success = await storageService.verifyAdminPassword(passwordInput);
    setIsVerifying(false);

    if (success) {
      setIsLoggedIn(true);
      loadData();
    } else {
      setLoginError('Password salah! Password default: "kamindipman2026"');
    }
  };

  const handleLogout = () => {
    storageService.adminLogout();
    setIsLoggedIn(false);
    setPasswordInput('');
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    storageService.updateOrderStatus(orderId, newStatus);
    loadData();
  };

  const handlePaymentStatusChange = (orderId: string, newPaymentStatus: PaymentStatus) => {
    storageService.updatePaymentStatus(orderId, newPaymentStatus);
    loadData();
  };

  const handleSaveProductPrice = (productId: string, newPrice: number) => {
    storageService.updateProductPrice(productId, newPrice);
    loadData();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...settings,
      adminWhatsApp: tempWhatsApp.replace(/\D/g, ''),
      alternatePhone: tempAlternatePhone,
      operationalHours: tempOperationalHours,
      quarryLocation: tempQuarryLocation,
    };
    storageService.saveCompanySettings(updated);
    setSettings(updated);
    setSettingsSaveNotice(true);
    setTimeout(() => setSettingsSaveNotice(false), 2500);
  };

  const handleSaveShippingZoneFee = (zoneId: string, newFee: number) => {
    storageService.updateShippingZoneFee(zoneId, newFee);
    loadData();
  };

  const handleCreateNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.addProduct({
      name: newProductForm.name,
      category: newProductForm.category,
      shortDescription: newProductForm.shortDescription,
      fullDescription: newProductForm.fullDescription || newProductForm.shortDescription,
      pricePerRit: Number(newProductForm.pricePerRit),
      available: newProductForm.available,
      stockRitEstimated: Number(newProductForm.stockRitEstimated),
      imageUrl: newProductForm.imageUrl,
      unit: newProductForm.unit,
      useCases: newProductForm.useCases.split(',').map((s) => s.trim()),
      specs: {
        origin: newProductForm.origin,
      },
    });
    setIsAddingProduct(false);
    loadData();
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus produk "${name}"?`)) {
      storageService.deleteProduct(id);
      loadData();
    }
  };

  const handleResetData = () => {
    if (confirm('Yakin ingin mereset seluruh database produk & pesanan ke data awal?')) {
      storageService.resetToDefaults();
      loadData();
    }
  };

  const analytics = storageService.getSalesAnalytics();

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = orderFilterStatus === 'all' || ord.orderStatus === orderFilterStatus;
    const matchesSearch =
      ord.orderCode.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
      ord.customerPhone.includes(searchOrderQuery);
    return matchesStatus && matchesSearch;
  });

  // If not logged in, render authentication wall
  if (!isLoggedIn) {
    return (
      <div className="py-20 bg-zinc-950 min-h-[700px] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-white space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Portal Admin CV KAMINDIPMAN</h2>
            <p className="text-xs text-zinc-400">
              Masuk untuk mengelola data produk, harga per rit, pesanan, status pengiriman, dan laporan penjualan di Nabire.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Username Admin:</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Password Admin:</label>
              <input
                type="password"
                placeholder="Masukkan password admin..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm rounded-lg shadow-lg transition-colors cursor-pointer"
            >
              {isVerifying ? 'Memverifikasi...' : 'Masuk ke Dashboard Admin'}
            </button>
          </form>

          <div className="p-3.5 bg-zinc-950/80 rounded-lg border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
            <span className="font-bold text-zinc-300 block">Kredensial Akses Bawaan Petugas:</span>
            <p>Username: <code className="text-orange-400 font-mono font-bold">admin</code></p>
            <p>Password: <code className="text-orange-400 font-mono font-bold">kamindipman2026</code> (atau <code className="text-orange-400 font-mono font-bold">admin123</code>)</p>
          </div>

          <div className="text-center">
            <button
              onClick={onExitAdmin}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              ← Kembali ke Beranda Pengunjung
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard Main UI
  return (
    <div className="bg-zinc-100 min-h-screen text-zinc-900 pb-20 relative">
      
      {/* Real-time On-Screen Toast Notification System */}
      <OrderNotificationToast
        toasts={toasts}
        onDismiss={handleDismissToast}
        onViewOrder={handleViewOrderFromNotification}
        onOpenInvoice={onOpenInvoice}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onPauseToast={handlePauseToast}
      />

      {/* Top Admin Bar */}
      <div className="bg-zinc-950 text-white border-b border-zinc-800 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-20 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-orange-600 flex items-center justify-center font-black text-white text-lg shrink-0">
            K
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight">
                Dashboard Manajemen CV KAMINDIPMAN
              </h1>
              <span className="bg-orange-950 text-orange-400 border border-orange-800 text-[10px] font-bold px-2 py-0.5 rounded">
                NABIRE PAPUA TENGAH
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Pengelolaan Material · Pemesanan · Status Pengiriman · Notifikasi Real-Time
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto relative">
          {/* Notification Center Bell Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              title="Notifikasi Pesanan Masuk Real-Time"
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer relative ${
                isNotifDropdownOpen
                  ? 'bg-orange-600 text-white border-orange-500 shadow-md'
                  : orders.filter((o) => o.orderStatus === 'pesanan_masuk').length > 0
                  ? 'bg-zinc-900 border-orange-500/80 text-orange-400 hover:text-white hover:bg-zinc-800'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="hidden md:inline">Notifikasi</span>
              {orders.filter((o) => o.orderStatus === 'pesanan_masuk').length > 0 && (
                <span className="bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow">
                  {orders.filter((o) => o.orderStatus === 'pesanan_masuk').length}
                </span>
              )}
            </button>

            {/* Notification Popover Dropdown */}
            {isNotifDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-950 text-white rounded-2xl border-2 border-orange-500/60 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2"
                style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 15px rgba(234, 88, 12, 0.3)' }}
              >
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                    </span>
                    <h3 className="font-extrabold text-sm text-white">Pesanan Masuk Real-Time</h3>
                  </div>
                  <span className="text-[11px] text-orange-400 font-mono font-bold bg-orange-950/80 px-2 py-0.5 rounded border border-orange-900">
                    {orders.filter((o) => o.orderStatus === 'pesanan_masuk').length} Menunggu Respon
                  </span>
                </div>

                <div className="py-2 divide-y divide-zinc-800/80 max-h-72 overflow-y-auto">
                  {orders.filter((o) => o.orderStatus === 'pesanan_masuk').length === 0 ? (
                    <div className="py-6 text-center text-zinc-400 text-xs">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                      Semua pesanan masuk sudah ditangani atau diproses.
                    </div>
                  ) : (
                    orders
                      .filter((o) => o.orderStatus === 'pesanan_masuk')
                      .slice(0, 6)
                      .map((ord) => {
                        let cleanPhone = ord.customerPhone.replace(/[^0-9]/g, '');
                        if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
                        else if (!cleanPhone.startsWith('62')) cleanPhone = '62' + cleanPhone;

                        const greetingMsg = encodeURIComponent(
                          `Halo Bpk/Ibu ${ord.customerName}, kami dari CV KAMINDIPMAN Nabire mengonfirmasi bahwa pesanan Anda (${ord.orderCode}) telah kami terima dan siap diproses.`
                        );

                        return (
                          <div key={ord.id} className="py-2.5 space-y-1.5 first:pt-1 last:pb-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="font-bold text-xs text-white block">
                                  {ord.customerName}
                                </span>
                                <span className="text-[10px] text-orange-400 font-mono">
                                  {ord.orderCode} • {ord.deliveryDistrict}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-400 font-mono">
                                {formatRupiah(ord.totalAmount)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-1">
                              <span className="text-[11px] text-zinc-400 truncate max-w-[180px]">
                                {ord.items.map((i) => `${i.productName} (${i.rit} Rit)`).join(', ')}
                              </span>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <a
                                  href={`https://wa.me/${cleanPhone}?text=${greetingMsg}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded flex items-center gap-1"
                                  title="Respon Cepat via WhatsApp"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  <span>WA</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleViewOrderFromNotification(ord)}
                                  className="px-2 py-1 bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-bold rounded flex items-center gap-1"
                                >
                                  <span>Buka</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={handleSimulateNewOrder}
                    className="text-orange-400 hover:text-orange-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    + Simulasi Pesanan Uji
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveAdminTab('orders');
                      setOrderFilterStatus('pesanan_masuk');
                      setIsNotifDropdownOpen(false);
                    }}
                    className="text-zinc-400 hover:text-white text-[11px] font-medium cursor-pointer"
                  >
                    Buka Semua ({orders.length}) →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Real-time Order Simulation button */}
          <button
            onClick={handleSimulateNewOrder}
            title="Kirim Pesanan Uji untuk Memeriksa On-Screen Toast & Audio Chime"
            className="px-3 py-1.5 bg-orange-950 hover:bg-orange-900 border border-orange-700 text-orange-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Uji Notifikasi Masuk</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Suara Chime Notifikasi: Aktif' : 'Suara Chime Notifikasi: Mati'}
            className={`p-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-zinc-900 border-zinc-700 text-emerald-400 hover:text-emerald-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-400'
            }`}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Desktop Notifications Toggle */}
          <button
            onClick={handleRequestDesktopNotification}
            title="Aktifkan Notifikasi Pop-up Desktop"
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              desktopNotificationEnabled
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {desktopNotificationEnabled ? 'Desktop: Aktif' : 'Aktifkan Desktop'}
            </span>
          </button>

          <button
            onClick={handleResetData}
            title="Reset Database ke Seed Awal"
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-red-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-white border-b border-zinc-200 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex overflow-x-auto gap-4 sm:gap-8 text-xs sm:text-sm font-semibold text-zinc-600">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'overview'
                ? 'border-orange-600 text-orange-600 font-bold'
                : 'border-transparent hover:text-zinc-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Ringkasan & Laporan Penjualan</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'orders'
                ? 'border-orange-600 text-orange-600 font-bold'
                : 'border-transparent hover:text-zinc-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Daftar Pesanan ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('products')}
            className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'products'
                ? 'border-orange-600 text-orange-600 font-bold'
                : 'border-transparent hover:text-zinc-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Kelola Produk & Harga Per Rit</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('shipping')}
            className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'shipping'
                ? 'border-orange-600 text-orange-600 font-bold'
                : 'border-transparent hover:text-zinc-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Ongkir Wilayah Nabire</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('newsletter')}
            className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'newsletter'
                ? 'border-orange-600 text-orange-600 font-bold'
                : 'border-transparent hover:text-zinc-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Pelanggan Buletin ({storageService.getNewsletterSubscribers().length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'settings'
                ? 'border-orange-600 text-orange-600 font-bold'
                : 'border-transparent hover:text-zinc-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan WhatsApp & Usaha</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* ============================================================ */}
        {/* TAB 1: OVERVIEW & LAPORAN PENJUALAN */}
        {/* ============================================================ */}
        {activeAdminTab === 'overview' && (
          <div className="space-y-6">
            
            {/* KPI Cards: Pendapatan Harian, Mingguan, Bulanan, Total */}
            <div>
              <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">
                Laporan Pendapatan & Penjualan Material:
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Harian */}
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold text-zinc-500">
                    <span>Pendapatan Hari Ini</span>
                    <Calendar className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="text-2xl font-black text-zinc-900 font-mono tracking-tight">
                    {formatRupiah(analytics.dailyRevenue)}
                  </div>
                  <div className="text-[11px] text-zinc-400">24 jam terakhir</div>
                </div>

                {/* Mingguan */}
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold text-zinc-500">
                    <span>Pendapatan Minggu Ini</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-zinc-900 font-mono tracking-tight">
                    {formatRupiah(analytics.weeklyRevenue)}
                  </div>
                  <div className="text-[11px] text-zinc-400">7 hari terakhir</div>
                </div>

                {/* Bulanan */}
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold text-zinc-500">
                    <span>Pendapatan Bulan Ini</span>
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-zinc-900 font-mono tracking-tight">
                    {formatRupiah(analytics.monthlyRevenue)}
                  </div>
                  <div className="text-[11px] text-zinc-400">Bulan berjalan 2026</div>
                </div>

                {/* Total Rit Terjual */}
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold text-zinc-500">
                    <span>Total Volume Rit Terjual</span>
                    <Truck className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-black text-zinc-900 font-mono tracking-tight">
                    {analytics.totalRitSold} <span className="text-sm font-normal text-zinc-500">Rit</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {analytics.paidOrdersCount} transaksi terverifikasi
                  </div>
                </div>

              </div>
            </div>

            {/* Volume Breakdown per Material */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wider">
                  Volume Rit Terjual per Kategori Material:
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Pasir Bangunan & Cor</span>
                      <span className="font-mono">{analytics.ritByCategory.pasir || 0} Rit</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-orange-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, ((analytics.ritByCategory.pasir || 0) / (analytics.totalRitSold || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Batu Belah & Pecah</span>
                      <span className="font-mono">{analytics.ritByCategory.batu || 0} Rit</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-zinc-800 h-full rounded-full"
                        style={{ width: `${Math.min(100, ((analytics.ritByCategory.batu || 0) / (analytics.totalRitSold || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Sirtu (Pasir Batu Pengerasan)</span>
                      <span className="font-mono">{analytics.ritByCategory.sirtu || 0} Rit</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, ((analytics.ritByCategory.sirtu || 0) / (analytics.totalRitSold || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Tanah Timbunan Padas</span>
                      <span className="font-mono">{analytics.ritByCategory.tanah_timbunan || 0} Rit</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-red-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, ((analytics.ritByCategory.tanah_timbunan || 0) / (analytics.totalRitSold || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wider">
                  Sebaran 8 Status Pesanan:
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(ORDER_STATUS_LABELS).map(([statusKey, info]) => {
                    const count = analytics.ordersByStatus[statusKey] || 0;
                    return (
                      <div key={statusKey} className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-200 flex justify-between items-center">
                        <span className="font-medium text-zinc-700 truncate pr-2">{info.label.split('. ')[1]}</span>
                        <span className="font-bold font-mono px-2 py-0.5 rounded bg-white border border-zinc-300">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: MANAJEMEN PESANAN LENGKAP */}
        {/* ============================================================ */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Filter and search bar */}
            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-zinc-600">Filter Status:</span>
                <select
                  value={orderFilterStatus}
                  onChange={(e) => setOrderFilterStatus(e.target.value)}
                  className="px-3 py-1.5 border border-zinc-300 rounded-lg text-xs font-semibold bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="all">Semua Status ({orders.length})</option>
                  {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Cari kode, nama pemesan, no HP..."
                  value={searchOrderQuery}
                  onChange={(e) => setSearchOrderQuery(e.target.value)}
                  className="w-full px-3 py-1.5 border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900 text-white uppercase text-[11px] font-bold">
                    <tr>
                      <th className="p-3.5">Kode Transaksi</th>
                      <th className="p-3.5">Pemesan & No. WA</th>
                      <th className="p-3.5">Material & Rit</th>
                      <th className="p-3.5">Alamat Pengiriman</th>
                      <th className="p-3.5">Total Biaya</th>
                      <th className="p-3.5">Status Pesanan</th>
                      <th className="p-3.5">Pembayaran</th>
                      <th className="p-3.5 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-zinc-500">
                          Tidak ada data pesanan yang sesuai filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr
                          key={ord.id}
                          id={`order-row-${ord.id}`}
                          className={`transition-all duration-300 ${
                            highlightedOrderId === ord.id
                              ? 'bg-orange-100/90 ring-2 ring-orange-500 shadow-md'
                              : ord.orderStatus === 'pesanan_masuk'
                              ? 'bg-amber-50/40 hover:bg-amber-50'
                              : 'hover:bg-zinc-50'
                          }`}
                        >
                          <td className="p-3.5 font-mono font-bold text-orange-600 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              {ord.orderStatus === 'pesanan_masuk' && (
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping shrink-0" title="Pesanan Baru Masuk" />
                              )}
                              <span>{ord.orderCode}</span>
                            </div>
                            <div className="text-[10px] text-zinc-400 font-sans font-normal">
                              {new Date(ord.createdAt).toLocaleDateString('id-ID')}
                            </div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <div className="font-bold text-zinc-900">{ord.customerName}</div>
                            <a
                              href={`https://wa.me/${ord.customerPhone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-emerald-600 font-mono hover:underline flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{ord.customerPhone}</span>
                            </a>
                          </td>

                          <td className="p-3.5">
                            {ord.items.map((i, idx) => (
                              <div key={idx} className="font-semibold text-zinc-800 whitespace-nowrap">
                                {i.productName}: <span className="font-bold text-orange-600">{i.rit} Rit</span>
                              </div>
                            ))}
                          </td>

                          <td className="p-3.5 max-w-xs">
                            <div className="truncate text-zinc-700" title={ord.deliveryAddress}>
                              {ord.deliveryAddress}
                            </div>
                            <div className="text-[10px] text-zinc-500">
                              {ord.deliveryDistrict} ({ord.deliveryMethod === 'delivery' ? 'Kirim' : 'Ambil Sendiri'})
                            </div>
                          </td>

                          <td className="p-3.5 font-mono font-bold text-zinc-900 whitespace-nowrap">
                            {formatRupiah(ord.totalAmount)}
                          </td>

                          {/* Order Status Select (All 8 Statuses) */}
                          <td className="p-3.5">
                            <select
                              value={ord.orderStatus}
                              onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                              className="px-2 py-1 border border-zinc-300 rounded font-bold text-xs bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                            >
                              {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => (
                                <option key={k} value={k}>
                                  {v.label}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Payment status toggle */}
                          <td className="p-3.5">
                            <select
                              value={ord.paymentStatus}
                              onChange={(e) => handlePaymentStatusChange(ord.id, e.target.value as PaymentStatus)}
                              className={`px-2 py-1 rounded text-xs font-bold border ${
                                ord.paymentStatus === 'paid'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : ord.paymentStatus === 'cod_pending'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : 'bg-zinc-100 text-zinc-800 border-zinc-300'
                              }`}
                            >
                              <option value="pending">Menunggu Bayar</option>
                              <option value="paid">Lunas (Paid)</option>
                              <option value="cod_pending">COD (Bayar di Tempat)</option>
                              <option value="failed">Gagal</option>
                            </select>
                          </td>

                          <td className="p-3.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {(() => {
                                let cleanPhone = ord.customerPhone.replace(/[^0-9]/g, '');
                                if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
                                else if (!cleanPhone.startsWith('62')) cleanPhone = '62' + cleanPhone;
                                const greeting = encodeURIComponent(
                                  `Halo Bpk/Ibu ${ord.customerName}, kami dari CV KAMINDIPMAN mengenai pesanan Anda (${ord.orderCode}) untuk material ${ord.items.map(i => `${i.productName} ${i.rit} Rit`).join(', ')} di ${ord.deliveryDistrict}. Mohon informasi apakah lokasi sudah siap untuk pengiriman dump truck? Terima kasih.`
                                );
                                return (
                                  <a
                                    href={`https://wa.me/${cleanPhone}?text=${greeting}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Respon Cepat via WhatsApp"
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    <span className="hidden xl:inline">WA</span>
                                  </a>
                                );
                              })()}
                              <button
                                onClick={() => onOpenInvoice(ord)}
                                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                                title="Buka Nota Digital Resmi"
                              >
                                <FileText className="w-3 h-3 text-orange-400" />
                                <span>Nota</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: KELOLA PRODUK & HARGA PER RIT */}
        {/* ============================================================ */}
        {activeAdminTab === 'products' && (
          <div className="space-y-6">
            
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">
                  Daftar Material & Pengaturan Harga Per Rit
                </h2>
                <p className="text-xs text-zinc-500">
                  Semua harga yang diubah di sini akan otomatis diterapkan pada kalkulator pemesanan pelanggan.
                </p>
              </div>

              <button
                onClick={() => setIsAddingProduct(!isAddingProduct)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingProduct ? 'Batal Tambah' : 'Tambah Produk Baru'}</span>
              </button>
            </div>

            {/* Form Tambah Produk Baru */}
            {isAddingProduct && (
              <form onSubmit={handleCreateNewProduct} className="bg-white p-6 rounded-xl border border-orange-300 shadow-md space-y-4">
                <h3 className="font-bold text-sm text-zinc-900">Form Tambah Material Baru:</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Nama Material:</label>
                    <input
                      type="text"
                      placeholder="Contoh: Pasir Plester Halus Wangar"
                      value={newProductForm.name}
                      onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Kategori:</label>
                    <select
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                    >
                      <option value="pasir">Pasir</option>
                      <option value="batu">Batu</option>
                      <option value="sirtu">Sirtu</option>
                      <option value="tanah_timbunan">Tanah Timbunan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Harga Per Rit (Rp):</label>
                    <input
                      type="number"
                      value={newProductForm.pricePerRit}
                      onChange={(e) => setNewProductForm({ ...newProductForm, pricePerRit: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Kegunaan (Pisahkan koma):</label>
                    <input
                      type="text"
                      value={newProductForm.useCases}
                      onChange={(e) => setNewProductForm({ ...newProductForm, useCases: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-zinc-700 mb-1">Deskripsi Singkat:</label>
                    <textarea
                      rows={2}
                      value={newProductForm.shortDescription}
                      onChange={(e) => setNewProductForm({ ...newProductForm, shortDescription: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingProduct(false)}
                    className="px-4 py-2 border rounded-lg text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg text-xs font-bold"
                  >
                    Simpan Material Baru
                  </button>
                </div>
              </form>
            )}

            {/* Product Cards Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((prod) => (
                <div key={prod.id} className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="flex gap-4 items-start">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-20 h-20 rounded-lg object-cover border border-zinc-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-zinc-900 truncate">{prod.name}</h4>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="text-zinc-400 hover:text-red-600 p-1"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{prod.shortDescription}</p>
                      
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-600">Harga per Rit:</span>
                        <input
                          type="number"
                          step="10000"
                          defaultValue={prod.pricePerRit}
                          onBlur={(e) => handleSaveProductPrice(prod.id, Number(e.target.value))}
                          className="w-36 px-2.5 py-1 text-sm font-mono font-bold border border-zinc-300 rounded text-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={prod.available}
                          onChange={(e) => {
                            storageService.updateProduct({ ...prod, available: e.target.checked });
                            loadData();
                          }}
                          className="rounded text-orange-600"
                        />
                        <span className="font-semibold text-zinc-700">Tersedia di Tambang</span>
                      </label>
                    </div>

                    <span className="text-zinc-400 text-[11px] font-mono">
                      ID: {prod.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: PENGATURAN ONGKIR WILAYAH NABIRE */}
        {/* ============================================================ */}
        {activeAdminTab === 'shipping' && (
          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">
                Tarif Ongkos Kirim Dump Truck per Wilayah Nabire
              </h2>
              <p className="text-xs text-zinc-500">
                Tarif dihitung per rit dump truck berdasarkan jarak tempuh dari Quarry Wangar Makmur, Nabire Barat.
              </p>
            </div>

            <div className="divide-y divide-zinc-200 border-t border-zinc-200">
              {zones.map((zone) => (
                <div key={zone.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <div className="font-bold text-sm text-zinc-900">{zone.name}</div>
                    <div className="text-xs text-zinc-500">{zone.description} · Estimasi: {zone.estimatedTime}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                      <span>Tarif / Rit:</span>
                      <input
                        type="number"
                        step="10000"
                        defaultValue={zone.feePerRit}
                        onBlur={(e) => handleSaveShippingZoneFee(zone.id, Number(e.target.value))}
                        className="w-32 px-2.5 py-1 text-sm font-mono font-bold border border-zinc-300 rounded text-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: PELANGGAN BULETIN & NEWSLETTER */}
        {/* ============================================================ */}
        {activeAdminTab === 'newsletter' && (
          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-orange-600" />
                  <span>Daftar Pelanggan Berlangganan Buletin Material</span>
                </h2>
                <p className="text-xs text-zinc-500">
                  Daftar email pelanggan dan kontraktor di Nabire yang mendaftar melalui formulir berlangganan buletin footer.
                </p>
              </div>

              <div className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full border border-orange-200">
                {storageService.getNewsletterSubscribers().length} Email Terdaftar
              </div>
            </div>

            <div className="overflow-x-auto border border-zinc-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 text-zinc-600 uppercase font-bold text-[10px] tracking-wider border-b border-zinc-200">
                  <tr>
                    <th className="py-3 px-4">No.</th>
                    <th className="py-3 px-4">Alamat Email Pelanggan</th>
                    <th className="py-3 px-4">Waktu Pendaftaran</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 text-zinc-800">
                  {storageService.getNewsletterSubscribers().map((sub, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/80">
                      <td className="py-3 px-4 font-mono text-zinc-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-zinc-900 font-mono">{sub.email}</td>
                      <td className="py-3 px-4 text-zinc-500">
                        {new Date(sub.subscribedAt).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })} WIT
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold text-[10px] border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Aktif Menerima Info</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 6: PENGATURAN WHATSAPP & INFORMASI PERUSAHAAN */}
        {/* ============================================================ */}
        {activeAdminTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">
                Pengaturan WhatsApp & Kontak CV KAMINDIPMAN
              </h2>
              <p className="text-xs text-zinc-500">
                Ubah nomor WhatsApp admin. Semua tombol WhatsApp di website akan langsung diarahkan ke nomor baru.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Nomor WhatsApp Admin Perusahaan (Format Internasional contoh 6282198765432):
                </label>
                <input
                  type="text"
                  value={tempWhatsApp}
                  onChange={(e) => setTempWhatsApp(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm font-mono text-zinc-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Nomor Telepon Alternatif / Mandor Quarry:
                </label>
                <input
                  type="text"
                  value={tempAlternatePhone}
                  onChange={(e) => setTempAlternatePhone(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-zinc-700 mb-1">
                  Alamat Quarry & Titik Pengambilan:
                </label>
                <input
                  type="text"
                  value={tempQuarryLocation}
                  onChange={(e) => setTempQuarryLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-zinc-700 mb-1">
                  Jam Operasional Pelayanan:
                </label>
                <input
                  type="text"
                  value={tempOperationalHours}
                  onChange={(e) => setTempOperationalHours(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900"
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 flex items-center justify-between">
              {settingsSaveNotice && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Pengaturan WhatsApp & Usaha Berhasil Disimpan!
                </span>
              )}
              <button
                type="submit"
                className="ml-auto px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg shadow transition-colors cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
