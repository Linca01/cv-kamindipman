import { Product, Order, CompanySettings, ShippingZone, OrderStatus, PaymentStatus, TestimonialItem } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COMPANY_SETTINGS, INITIAL_SHIPPING_ZONES, SEED_ORDERS, INITIAL_TESTIMONIALS } from '../data/initialData';
import { generateOrderCode, calculateOrderTotal, sha256Hash } from '../utils/orderCalculator';

const STORAGE_KEYS = {
  PRODUCTS: 'kmd_products_v1',
  ORDERS: 'kmd_orders_v1',
  SETTINGS: 'kmd_settings_v1',
  SHIPPING_ZONES: 'kmd_shipping_zones_v1',
  TESTIMONIALS: 'kmd_testimonials_v1',
  ADMIN_SESSION: 'kmd_admin_session_v1',
};

// Event emitter helper for cross-component reactivity
const STORAGE_EVENT = 'kmd_data_updated';

function notifyChange(scope: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { scope } }));
  }
}

class StorageService {
  // PRODUCTS
  getProducts(): Product[] {
    if (typeof window === 'undefined') return INITIAL_PRODUCTS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    } catch {
      // Ignore
    }
    return INITIAL_PRODUCTS;
  }

  saveProducts(products: Product[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    notifyChange('products');
  }

  getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  }

  updateProductPrice(id: string, newPricePerRit: number): boolean {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1 && newPricePerRit >= 0) {
      products[index].pricePerRit = Math.round(newPricePerRit);
      this.saveProducts(products);
      return true;
    }
    return false;
  }

  updateProduct(product: Product): boolean {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = product;
      this.saveProducts(products);
      return true;
    }
    return false;
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length !== products.length) {
      this.saveProducts(filtered);
      return true;
    }
    return false;
  }

  // ORDERS
  getOrders(): Order[] {
    if (typeof window === 'undefined') return SEED_ORDERS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
    } catch {
      // Ignore
    }
    return SEED_ORDERS;
  }

  saveOrders(orders: Order[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    notifyChange('orders');
  }

  getOrderByCode(code: string): Order | undefined {
    const clean = code.trim().toUpperCase();
    return this.getOrders().find(
      o => o.orderCode.toUpperCase() === clean || o.customerPhone.replace(/\D/g, '').endsWith(clean.replace(/\D/g, ''))
    );
  }

  createOrder(orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryMethod: 'delivery' | 'pickup';
    deliveryAddress: string;
    deliveryDistrict: string;
    deliveryNotes?: string;
    items: Array<{ productId: string; rit: number }>;
    shippingZoneId?: string;
    paymentMethod: 'online' | 'cod' | 'whatsapp';
  }): Order {
    const currentProducts = this.getProducts();
    const zones = this.getShippingZones();
    const selectedZone = zones.find(z => z.id === orderData.shippingZoneId);
    const shippingFeePerRit = orderData.deliveryMethod === 'delivery' ? (selectedZone?.feePerRit || 150000) : 0;

    // Critical security: Prices are determined by official product database, NOT by customer input
    const orderItems = orderData.items.map(item => {
      const prod = currentProducts.find(p => p.id === item.productId);
      const pricePerRit = prod ? prod.pricePerRit : 1000000;
      const rit = Math.max(1, Math.round(item.rit));
      return {
        productId: item.productId,
        productName: prod ? prod.name : 'Material Bangunan',
        category: prod ? prod.category : 'pasir',
        rit,
        pricePerRit,
        subtotal: pricePerRit * rit,
      };
    });

    const calculation = calculateOrderTotal(
      orderItems.map(i => ({ pricePerRit: i.pricePerRit, rit: i.rit })),
      orderData.deliveryMethod,
      shippingFeePerRit
    );

    const now = new Date().toISOString();
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderCode: generateOrderCode(),
      customerName: orderData.customerName.trim(),
      customerPhone: orderData.customerPhone.trim(),
      customerEmail: orderData.customerEmail?.trim(),
      deliveryMethod: orderData.deliveryMethod,
      deliveryAddress: orderData.deliveryAddress.trim(),
      deliveryDistrict: orderData.deliveryDistrict.trim(),
      deliveryNotes: orderData.deliveryNotes?.trim(),
      items: orderItems,
      subtotalMaterial: calculation.subtotalMaterial,
      shippingFee: calculation.shippingFee,
      totalAmount: calculation.grandTotal,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'cod' ? 'cod_pending' : 'pending',
      orderStatus: 'pesanan_masuk',
      createdAt: now,
      updatedAt: now,
    };

    const orders = this.getOrders();
    orders.unshift(newOrder);
    this.saveOrders(orders);
    
    // Dispatch real-time visual & audio alert event for Admin Dashboard
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kmd_new_order_alert', { detail: { order: newOrder } }));
    }
    
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderStatus, adminNotes?: string): boolean {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].orderStatus = status;
      orders[index].updatedAt = new Date().toISOString();
      if (adminNotes !== undefined) {
        orders[index].adminNotes = adminNotes;
      }
      // Auto synchronize payment status if completed or confirmed
      if (status === 'pembayaran_berhasil' && orders[index].paymentStatus !== 'paid') {
        orders[index].paymentStatus = 'paid';
      }
      this.saveOrders(orders);
      return true;
    }
    return false;
  }

  updatePaymentStatus(
    orderId: string,
    status: PaymentStatus,
    paymentDetails?: {
      gateway?: 'midtrans' | 'xendit' | 'manual_transfer';
      channel?: 'qris' | 'va_bca' | 'va_bri' | 'va_mandiri' | 'gopay' | 'cod';
      transactionId?: string;
    }
  ): boolean {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].paymentStatus = status;
      orders[index].updatedAt = new Date().toISOString();
      if (status === 'paid') {
        orders[index].orderStatus = 'pembayaran_berhasil';
        orders[index].paymentDetails = {
          ...paymentDetails,
          paidAt: new Date().toISOString(),
        };
      }
      this.saveOrders(orders);
      return true;
    }
    return false;
  }

  // SHIPPING ZONES
  getShippingZones(): ShippingZone[] {
    if (typeof window === 'undefined') return INITIAL_SHIPPING_ZONES;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SHIPPING_ZONES);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    try {
      localStorage.setItem(STORAGE_KEYS.SHIPPING_ZONES, JSON.stringify(INITIAL_SHIPPING_ZONES));
    } catch {
      // Ignore
    }
    return INITIAL_SHIPPING_ZONES;
  }

  saveShippingZones(zones: ShippingZone[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SHIPPING_ZONES, JSON.stringify(zones));
    notifyChange('shipping_zones');
  }

  updateShippingZoneFee(id: string, newFeePerRit: number): boolean {
    const zones = this.getShippingZones();
    const idx = zones.findIndex(z => z.id === id);
    if (idx !== -1 && newFeePerRit >= 0) {
      zones[idx].feePerRit = Math.round(newFeePerRit);
      this.saveShippingZones(zones);
      return true;
    }
    return false;
  }

  // COMPANY SETTINGS
  getCompanySettings(): CompanySettings {
    if (typeof window === 'undefined') return INITIAL_COMPANY_SETTINGS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed: CompanySettings = JSON.parse(saved);
        // Ensure official updated WhatsApp number from user request
        if (!parsed.adminWhatsApp || parsed.adminWhatsApp === '6282198765432') {
          parsed.adminWhatsApp = '6282137238800';
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch {
      // Fallback
    }
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_COMPANY_SETTINGS));
    } catch {
      // Ignore
    }
    return INITIAL_COMPANY_SETTINGS;
  }

  saveCompanySettings(settings: CompanySettings): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    notifyChange('settings');
  }

  updateWhatsAppNumber(phone: string): void {
    const settings = this.getCompanySettings();
    settings.adminWhatsApp = phone.replace(/\D/g, '');
    this.saveCompanySettings(settings);
  }

  // AUTHENTICATION
  async verifyAdminPassword(password: string): Promise<boolean> {
    const settings = this.getCompanySettings();
    const hash = await sha256Hash(password);
    // Allow default "kamindipman2026", "admin123", "admin", or custom saved hash
    const isValid = hash === settings.adminPasswordHash || 
                    password === 'kamindipman2026' || 
                    password === 'admin123' || 
                    password === 'admin';
    if (isValid) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
      }
    }
    return isValid;
  }

  isAdminLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
  }

  adminLogout(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    notifyChange('admin_session');
  }

  async setAdminPassword(newPassword: string): Promise<void> {
    const settings = this.getCompanySettings();
    settings.adminPasswordHash = await sha256Hash(newPassword);
    this.saveCompanySettings(settings);
  }

  // TESTIMONIALS & FEEDBACK
  getTestimonials(): TestimonialItem[] {
    if (typeof window === 'undefined') return INITIAL_TESTIMONIALS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    try {
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(INITIAL_TESTIMONIALS));
    } catch {
      // Ignore
    }
    return INITIAL_TESTIMONIALS;
  }

  saveTestimonials(testimonials: TestimonialItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
    notifyChange('testimonials');
  }

  // ORDER VERIFICATION FOR CUSTOMER REVIEWS
  getCompletedOrders(): Order[] {
    const orders = this.getOrders();
    return orders.filter(o => o.orderStatus === 'pesanan_selesai');
  }

  verifyCompletedOrder(orderCodeInput: string): {
    success: boolean;
    order?: Order;
    message: string;
    isCompleted: boolean;
  } {
    const cleanCode = orderCodeInput.trim().toUpperCase();
    if (!cleanCode) {
      return {
        success: false,
        message: 'Silakan masukkan kode pesanan Anda (contoh: KMD-202611-1015).',
        isCompleted: false,
      };
    }

    const orders = this.getOrders();
    const foundOrder = orders.find(
      o => o.orderCode.toUpperCase() === cleanCode || o.id === orderCodeInput.trim()
    );

    if (!foundOrder) {
      return {
        success: false,
        message: `Pesanan dengan kode "${cleanCode}" tidak ditemukan dalam sistem. Harap periksa kembali nomor nota digital Anda.`,
        isCompleted: false,
      };
    }

    if (foundOrder.orderStatus !== 'pesanan_selesai') {
      const statusLabels: Record<string, string> = {
        pesanan_masuk: 'Pesanan Masuk (Baru Diterima)',
        menunggu_konfirmasi: 'Menunggu Konfirmasi Admin/Mandor',
        menunggu_pembayaran: 'Menunggu Pembayaran',
        pembayaran_berhasil: 'Pembayaran Berhasil',
        pesanan_diproses: 'Sedang Dimuat di Kuari Wangar',
        dalam_pengiriman: 'Dalam Perjalanan Dump Truck',
        pesanan_dibatalkan: 'Pesanan Dibatalkan',
      };
      const currentStatusLabel = statusLabels[foundOrder.orderStatus] || foundOrder.orderStatus;
      return {
        success: false,
        order: foundOrder,
        message: `Pesanan ${foundOrder.orderCode} saat ini masih berstatus "${currentStatusLabel}". Ulasan dan rating hanya dapat diberikan setelah pengiriman material tuntas dan status pesanan telah diubah menjadi "Pesanan Selesai".`,
        isCompleted: false,
      };
    }

    return {
      success: true,
      order: foundOrder,
      message: `Verifikasi Berhasil! Pesanan ${foundOrder.orderCode} terkonfirmasi telah selesai diterima oleh ${foundOrder.customerName}.`,
      isCompleted: true,
    };
  }

  addTestimonial(data: Omit<TestimonialItem, 'id' | 'createdAt'>): TestimonialItem {
    const list = this.getTestimonials();
    const newTestimonial: TestimonialItem = {
      ...data,
      id: `testi_user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      isNew: true,
      isVerified: data.isVerified !== undefined ? data.isVerified : Boolean(data.orderCode),
    };
    list.unshift(newTestimonial);
    this.saveTestimonials(list);
    return newTestimonial;
  }

  submitVerifiedReview(params: {
    orderCode: string;
    name: string;
    role?: string;
    companyOrProject?: string;
    district: string;
    category: 'kontraktor' | 'jalan' | 'hunian';
    rating: number;
    materialSupplied: string;
    verifiedVolume: string;
    content: string;
  }): { success: boolean; review?: TestimonialItem; message: string } {
    const verification = this.verifyCompletedOrder(params.orderCode);
    if (!verification.success || !verification.order) {
      return {
        success: false,
        message: verification.message,
      };
    }

    const categoryLabels: Record<string, string> = {
      kontraktor: 'Kontraktor Gedung',
      jalan: 'Infrastruktur Jalan',
      hunian: 'Hunian & Ruko',
    };

    const newReview = this.addTestimonial({
      orderCode: verification.order.orderCode,
      name: params.name.trim() || verification.order.customerName,
      role: params.role?.trim() || 'Pelanggan Terverifikasi',
      companyOrProject: params.companyOrProject?.trim() || `Proyek ${verification.order.deliveryDistrict}`,
      district: params.district.trim() || verification.order.deliveryDistrict,
      category: params.category,
      categoryLabel: categoryLabels[params.category] || 'Proyek Konstruksi',
      rating: Math.max(1, Math.min(5, params.rating)),
      materialSupplied: params.materialSupplied.trim() || verification.order.items.map(i => i.productName).join(' + '),
      verifiedVolume: params.verifiedVolume.trim() || `${verification.order.items.reduce((acc, i) => acc + i.rit, 0)} Rit`,
      content: params.content.trim(),
      isVerified: true,
    });

    return {
      success: true,
      review: newReview,
      message: 'Ulasan Anda berhasil diverifikasi dan dipublikasikan di halaman beranda!',
    };
  }


  // SALES REPORTS & ANALYTICS
  getSalesAnalytics(): {
    totalRevenue: number;
    dailyRevenue: number;
    weeklyRevenue: number;
    monthlyRevenue: number;
    totalRitSold: number;
    ritByCategory: Record<string, number>;
    ordersByStatus: Record<string, number>;
    totalOrders: number;
    paidOrdersCount: number;
  } {
    const orders = this.getOrders();
    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const sevenDaysMs = 7 * oneDayMs;
    const thirtyDaysMs = 30 * oneDayMs;

    let totalRevenue = 0;
    let dailyRevenue = 0;
    let weeklyRevenue = 0;
    let monthlyRevenue = 0;
    let totalRitSold = 0;
    let paidOrdersCount = 0;

    const ritByCategory: Record<string, number> = {
      pasir: 0,
      batu: 0,
      sirtu: 0,
      tanah_timbunan: 0,
    };

    const ordersByStatus: Record<string, number> = {
      pesanan_masuk: 0,
      menunggu_konfirmasi: 0,
      menunggu_pembayaran: 0,
      pembayaran_berhasil: 0,
      pesanan_diproses: 0,
      dalam_pengiriman: 0,
      pesanan_selesai: 0,
      pesanan_dibatalkan: 0,
    };

    for (const order of orders) {
      // Tally status
      ordersByStatus[order.orderStatus] = (ordersByStatus[order.orderStatus] || 0) + 1;

      // Only count completed or paid orders or active processing in revenue
      const isPaidOrActive =
        order.paymentStatus === 'paid' ||
        ['pembayaran_berhasil', 'pesanan_diproses', 'dalam_pengiriman', 'pesanan_selesai'].includes(
          order.orderStatus
        );

      if (isPaidOrActive) {
        paidOrdersCount++;
        totalRevenue += order.totalAmount;

        const orderTime = new Date(order.createdAt).getTime();
        const diff = now.getTime() - orderTime;

        if (diff <= oneDayMs) {
          dailyRevenue += order.totalAmount;
        }
        if (diff <= sevenDaysMs) {
          weeklyRevenue += order.totalAmount;
        }
        if (diff <= thirtyDaysMs) {
          monthlyRevenue += order.totalAmount;
        }

        // Tally rit
        for (const item of order.items) {
          totalRitSold += item.rit;
          ritByCategory[item.category] = (ritByCategory[item.category] || 0) + item.rit;
        }
      }
    }

    return {
      totalRevenue,
      dailyRevenue,
      weeklyRevenue,
      monthlyRevenue,
      totalRitSold,
      ritByCategory,
      ordersByStatus,
      totalOrders: orders.length,
      paidOrdersCount,
    };
  }

  // Reset to original seed data for demo purposes
  resetToDefaults(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.SHIPPING_ZONES);
    localStorage.removeItem(STORAGE_KEYS.TESTIMONIALS);
    this.saveProducts(INITIAL_PRODUCTS);
    this.saveOrders(SEED_ORDERS);
    this.saveCompanySettings(INITIAL_COMPANY_SETTINGS);
    this.saveShippingZones(INITIAL_SHIPPING_ZONES);
    this.saveTestimonials(INITIAL_TESTIMONIALS);
    notifyChange('reset');
  }

  // NEWSLETTER SUBSCRIBERS
  getNewsletterSubscribers(): Array<{ email: string; subscribedAt: string }> {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('kmd_newsletter_subscribers');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [
      { email: 'kontraktor.nabire@gmail.com', subscribedAt: '2026-11-01T08:30:00Z' },
      { email: 'proyek.papuatengah@yahoo.com', subscribedAt: '2026-11-03T11:15:00Z' },
    ];
  }

  subscribeNewsletter(email: string): { success: boolean; message: string } {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, message: 'Format email tidak valid. Masukkan email yang benar.' };
    }
    const current = this.getNewsletterSubscribers();
    if (current.some(s => s.email === cleanEmail)) {
      return { success: true, message: 'Email Anda sudah terdaftar dalam daftar buletin material CV KAMINDIPMAN.' };
    }
    current.unshift({ email: cleanEmail, subscribedAt: new Date().toISOString() });
    try {
      localStorage.setItem('kmd_newsletter_subscribers', JSON.stringify(current));
    } catch {
      // Ignore
    }
    notifyChange('newsletter');
    return { success: true, message: 'Terima kasih! Anda berhasil berlangganan buletin & info promo CV KAMINDIPMAN.' };
  }

  // Listener helper
  subscribe(callback: (scope: string) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      callback(customEvent.detail?.scope || 'all');
    };
    window.addEventListener(STORAGE_EVENT, handler);
    return () => window.removeEventListener(STORAGE_EVENT, handler);
  }
}

export const storageService = new StorageService();
