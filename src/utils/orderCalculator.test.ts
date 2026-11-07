import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateItemSubtotal,
  calculateOrderTotal,
  formatRupiah,
  generateOrderCode,
  generateWhatsAppOrderMessage,
  generateWhatsAppDirectUrl,
  validateOrderInput,
} from './orderCalculator';

test('calculateItemSubtotal calculates rit x pricePerRit correctly', () => {
  assert.equal(calculateItemSubtotal(1250000, 3), 3750000);
  assert.equal(calculateItemSubtotal(950000, 1), 950000);
  assert.equal(calculateItemSubtotal(0, 5), 0);
  assert.equal(calculateItemSubtotal(1000, 0), 0);
  assert.equal(calculateItemSubtotal(-500, 2), 0);
});

test('calculateOrderTotal calculates material subtotal and shipping fees per rit', () => {
  const items = [
    { pricePerRit: 1250000, rit: 3 }, // 3.750.000
    { pricePerRit: 950000, rit: 2 },  // 1.900.000
  ];

  // Delivery with shipping fee of 150.000 per rit (5 rit total = 750.000)
  const deliveryResult = calculateOrderTotal(items, 'delivery', 150000);
  assert.equal(deliveryResult.totalRit, 5);
  assert.equal(deliveryResult.subtotalMaterial, 5650000);
  assert.equal(deliveryResult.shippingFee, 750000);
  assert.equal(deliveryResult.grandTotal, 6400000);

  // Self pickup (shipping fee must be 0)
  const pickupResult = calculateOrderTotal(items, 'pickup', 150000);
  assert.equal(pickupResult.totalRit, 5);
  assert.equal(pickupResult.shippingFee, 0);
  assert.equal(pickupResult.grandTotal, 5650000);
});

test('formatRupiah formats Indonesian currency with thousands separator', () => {
  assert.equal(formatRupiah(1250000), 'Rp 1.250.000');
  assert.equal(formatRupiah(950000), 'Rp 950.000');
  assert.equal(formatRupiah(0), 'Rp 0');
});

test('generateOrderCode generates unique KMD-YYYYMM-XXXX pattern', () => {
  const code = generateOrderCode(new Date(2026, 10, 7)); // November 2026
  assert.match(code, /^KMD-202611-\d{4}$/);
});

test('generateWhatsAppOrderMessage formats required prompt message template accurately', () => {
  const message = generateWhatsAppOrderMessage({
    customerName: 'Yohanes Pigai',
    customerPhone: '081234567890',
    materialName: 'Pasir Bangunan & Cor',
    rit: 3,
    pricePerRit: 1250000,
    totalAmount: 3750000,
    deliveryAddress: 'Jl. Poros Wangar Makmur No. 12',
    deliveryDistrict: 'Distrik Nabire Barat',
    paymentMethod: 'cod',
    orderCode: 'KMD-202611-1029',
  });

  assert.ok(message.includes('Halo CV KAMINDIPMAN, saya ingin memesan material.'));
  assert.ok(message.includes('Nama: Yohanes Pigai'));
  assert.ok(message.includes('Nomor HP: 081234567890'));
  assert.ok(message.includes('Jenis Material: Pasir Bangunan & Cor'));
  assert.ok(message.includes('Jumlah Rit: 3 rit'));
  assert.ok(message.includes('Harga Per Rit: Rp 1.250.000'));
  assert.ok(message.includes('Total Pesanan: Rp 3.750.000'));
  assert.ok(message.includes('Lokasi Pengiriman: Jl. Poros Wangar Makmur No. 12 (Distrik Nabire Barat)'));
  assert.ok(message.includes('Metode Pembayaran: COD (Cash On Delivery saat tiba)'));
  assert.ok(message.includes('Mohon informasi dan konfirmasi pesanan saya.'));
});

test('generateWhatsAppDirectUrl cleans and formats phone to wa.me standard', () => {
  const url1 = generateWhatsAppDirectUrl('082198765432', 'Halo admin');
  assert.equal(url1, 'https://wa.me/6282198765432?text=Halo%20admin');

  const url2 = generateWhatsAppDirectUrl('+62 821-9876-5432', 'Tes');
  assert.equal(url2, 'https://wa.me/6282198765432?text=Tes');
});

test('validateOrderInput validates required customer fields and rit count', () => {
  const invalid = validateOrderInput({
    customerName: 'A',
    customerPhone: '123',
    deliveryMethod: 'delivery',
    deliveryAddress: '',
    deliveryDistrict: '',
    rit: 0,
    paymentMethod: '',
  });

  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.customerName);
  assert.ok(invalid.errors.customerPhone);
  assert.ok(invalid.errors.rit);
  assert.ok(invalid.errors.deliveryAddress);
  assert.ok(invalid.errors.paymentMethod);

  const valid = validateOrderInput({
    customerName: 'Bapak Markus',
    customerPhone: '081298765432',
    deliveryMethod: 'delivery',
    deliveryAddress: 'Jl. Pemuda No. 45, Kalibobo',
    deliveryDistrict: 'Nabire Kota',
    rit: 4,
    paymentMethod: 'online',
  });

  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});
