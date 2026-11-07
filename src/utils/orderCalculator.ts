/**
 * Business logic and pure calculation functions for CV KAMINDIPMAN
 */

export interface OrderCalculationItem {
  pricePerRit: number;
  rit: number;
}

/**
 * Calculates subtotal for a material item: HARGA PER RIT x JUMLAH RIT
 */
export function calculateItemSubtotal(pricePerRit: number, rit: number): number {
  if (pricePerRit < 0 || rit < 0) return 0;
  return Math.round(pricePerRit * rit);
}

/**
 * Calculates grand order total including shipping fee per rit
 */
export function calculateOrderTotal(
  items: OrderCalculationItem[],
  deliveryMethod: 'delivery' | 'pickup',
  shippingFeePerRit: number = 0
): {
  totalRit: number;
  subtotalMaterial: number;
  shippingFee: number;
  grandTotal: number;
} {
  const totalRit = items.reduce((sum, item) => sum + (Number(item.rit) || 0), 0);
  const subtotalMaterial = items.reduce(
    (sum, item) => sum + calculateItemSubtotal(Number(item.pricePerRit) || 0, Number(item.rit) || 0),
    0
  );

  const shippingFee = deliveryMethod === 'delivery' ? Math.round(totalRit * (Number(shippingFeePerRit) || 0)) : 0;
  const grandTotal = subtotalMaterial + shippingFee;

  return {
    totalRit,
    subtotalMaterial,
    shippingFee,
    grandTotal,
  };
}

/**
 * Formats a number to Indonesian Rupiah currency string (e.g. Rp 1.250.000)
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount)) return 'Rp 0';
  return 'Rp ' + Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Generates unique readable order code, e.g. KMD-202611-4829
 */
export function generateOrderCode(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `KMD-${year}${month}-${randomSuffix}`;
}

export interface WhatsAppMessageParams {
  customerName: string;
  customerPhone: string;
  materialName: string;
  rit: number;
  pricePerRit: number;
  totalAmount: number;
  deliveryAddress: string;
  deliveryDistrict?: string;
  paymentMethod: string;
  orderCode?: string;
}

/**
 * Generates official structured WhatsApp message text for CV KAMINDIPMAN
 */
export function generateWhatsAppOrderMessage(params: WhatsAppMessageParams): string {
  const paymentMethodLabel = 
    params.paymentMethod === 'online' ? 'Pembayaran Online (QRIS / Transfer)' :
    params.paymentMethod === 'cod' ? 'COD (Cash On Delivery saat tiba)' :
    'Pembayaran Melalui WhatsApp (Konfirmasi Admin)';

  const lines = [
    'Halo CV KAMINDIPMAN, saya ingin memesan material.',
    '',
    `Nama: ${params.customerName || '-'}`,
    `Nomor HP: ${params.customerPhone || '-'}`,
    `Jenis Material: ${params.materialName || '-'}`,
    `Jumlah Rit: ${params.rit} rit`,
    `Harga Per Rit: ${formatRupiah(params.pricePerRit)}`,
    `Total Pesanan: ${formatRupiah(params.totalAmount)}`,
    `Lokasi Pengiriman: ${params.deliveryAddress}${params.deliveryDistrict ? ` (${params.deliveryDistrict})` : ''}`,
    `Metode Pembayaran: ${paymentMethodLabel}`,
  ];

  if (params.orderCode) {
    lines.push(`Kode Pesanan: ${params.orderCode}`);
  }

  lines.push('');
  lines.push('Mohon informasi dan konfirmasi pesanan saya.');

  return lines.join('\n');
}

/**
 * Builds direct WhatsApp URL with phone number and pre-filled message
 */
export function generateWhatsAppDirectUrl(rawPhone: string, message: string): string {
  // Normalize phone number to standard international format (without + or leading 0)
  let cleanPhone = rawPhone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith('62')) {
    cleanPhone = '62' + cleanPhone;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export interface OrderInputValidation {
  customerName: string;
  customerPhone: string;
  deliveryMethod: 'delivery' | 'pickup';
  deliveryAddress: string;
  deliveryDistrict?: string;
  rit: number;
  paymentMethod: string;
}

/**
 * Validates order inputs before submission
 */
export function validateOrderInput(input: OrderInputValidation): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.customerName || input.customerName.trim().length < 3) {
    errors.customerName = 'Nama pemesan minimal 3 karakter';
  }

  const phoneDigits = (input.customerPhone || '').replace(/\D/g, '');
  if (phoneDigits.length < 9 || phoneDigits.length > 15) {
    errors.customerPhone = 'Nomor WhatsApp tidak valid (minimal 9 digit)';
  }

  if (!input.rit || input.rit < 1) {
    errors.rit = 'Jumlah pesanan minimal 1 rit';
  } else if (!Number.isInteger(Number(input.rit))) {
    errors.rit = 'Jumlah rit harus berupa bilangan bulat';
  }

  if (input.deliveryMethod === 'delivery') {
    if (!input.deliveryAddress || input.deliveryAddress.trim().length < 5) {
      errors.deliveryAddress = 'Alamat pengiriman harus diisi lengkap (patokan / jalan)';
    }
    if (!input.deliveryDistrict) {
      errors.deliveryDistrict = 'Pilih wilayah / distrik pengiriman di Nabire';
    }
  }

  if (!input.paymentMethod) {
    errors.paymentMethod = 'Pilih metode pembayaran';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Simple asynchronous SHA-256 hash calculation for browser and node
 */
export async function sha256Hash(text: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback simple hash for older environments
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}
