export type MaterialCategory = 'pasir' | 'batu' | 'sirtu' | 'tanah_timbunan';

export interface Product {
  id: string;
  name: string;
  category: MaterialCategory;
  shortDescription: string;
  fullDescription: string;
  useCases: string[];
  pricePerRit: number;
  available: boolean;
  stockRitEstimated: number;
  imageUrl: string;
  unit: string; // e.g. "Rit (Dump Truck ~4-5 m³)"
  specs: {
    origin: string;
    grainSize?: string;
    color?: string;
    density?: string;
  };
}

export type DeliveryMethod = 'delivery' | 'pickup';

export type PaymentMethod = 'online' | 'cod' | 'whatsapp';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'cod_pending'
  | 'failed';

export type OrderStatus =
  | 'pesanan_masuk'
  | 'menunggu_konfirmasi'
  | 'menunggu_pembayaran'
  | 'pembayaran_berhasil'
  | 'pesanan_diproses'
  | 'dalam_pengiriman'
  | 'pesanan_selesai'
  | 'pesanan_dibatalkan';

export interface OrderItem {
  productId: string;
  productName: string;
  category: MaterialCategory;
  rit: number;
  pricePerRit: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderCode: string; // e.g. KMD-202611-1029
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: string;
  deliveryDistrict: string;
  deliveryNotes?: string;
  items: OrderItem[];
  subtotalMaterial: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  paymentDetails?: {
    gateway?: 'midtrans' | 'xendit' | 'manual_transfer';
    channel?: 'qris' | 'va_bca' | 'va_bri' | 'va_mandiri' | 'gopay' | 'cod';
    transactionId?: string;
    paidAt?: string;
  };
  adminNotes?: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  feePerRit: number;
  estimatedTime: string;
  description: string;
}

export interface BankAccount {
  bank: string;
  accountNumber: string;
  accountHolder: string;
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  description: string;
  adminWhatsApp: string; // Phone number without + or with 62
  alternatePhone: string;
  email: string;
  quarryLocation: string;
  district: string;
  city: string;
  province: string;
  operationalHours: string;
  bankAccounts: BankAccount[];
  adminPasswordHash: string; // SHA-256 hashed
}

export interface CartItem {
  product: Product;
  rit: number;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  companyOrProject: string;
  district: string;
  category: 'kontraktor' | 'jalan' | 'hunian';
  categoryLabel: string;
  rating: number; // 1 - 5 stars
  materialSupplied: string;
  verifiedVolume: string;
  content: string;
  createdAt?: string;
  isNew?: boolean;
  orderCode?: string; // Verified order code (e.g. KMD-202611-1015)
  isVerified?: boolean; // True if verified from a completed order
}

export type CustomerReview = TestimonialItem;

