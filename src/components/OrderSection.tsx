import React from 'react';
import { 
  Calculator, 
  MapPin, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  MessageCircle, 
  ShieldCheck, 
  Banknote,
  Send
} from 'lucide-react';
import { Product, ShippingZone, CompanySettings, Order } from '../types';
import { 
  formatRupiah, 
  calculateOrderTotal, 
  validateOrderInput, 
  generateWhatsAppOrderMessage,
  generateWhatsAppDirectUrl 
} from '../utils/orderCalculator';
import { storageService } from '../services/storageService';

interface OrderSectionProps {
  products: Product[];
  shippingZones: ShippingZone[];
  settings: CompanySettings;
  preSelectedProductId?: string;
  preSelectedRit?: number;
  onOrderSuccess: (order: Order) => void;
  onOpenPaymentModal: (order: Order) => void;
}

export const OrderSection: React.FC<OrderSectionProps> = ({
  products,
  shippingZones,
  settings,
  preSelectedProductId,
  preSelectedRit = 3,
  onOrderSuccess,
  onOpenPaymentModal,
}) => {
  // Form State
  const [selectedProductId, setSelectedProductId] = React.useState<string>(
    preSelectedProductId || products[0]?.id || ''
  );
  const [rit, setRit] = React.useState<number>(preSelectedRit);
  const [customerName, setCustomerName] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [customerEmail, setCustomerEmail] = React.useState('');
  const [deliveryMethod, setDeliveryMethod] = React.useState<'delivery' | 'pickup'>('delivery');
  const [shippingZoneId, setShippingZoneId] = React.useState<string>(shippingZones[0]?.id || '');
  const [deliveryAddress, setDeliveryAddress] = React.useState('');
  const [deliveryNotes, setDeliveryNotes] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState<'online' | 'cod' | 'whatsapp'>('online');

  // Validation & UI State
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Synchronize when preSelected changes
  React.useEffect(() => {
    if (preSelectedProductId) {
      setSelectedProductId(preSelectedProductId);
    }
  }, [preSelectedProductId]);

  React.useEffect(() => {
    if (preSelectedRit) {
      setRit(preSelectedRit);
    }
  }, [preSelectedRit]);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const selectedZone = shippingZones.find((z) => z.id === shippingZoneId) || shippingZones[0];

  // Real-time calculation
  const calculation = calculateOrderTotal(
    [{ pricePerRit: selectedProduct?.pricePerRit || 0, rit }],
    deliveryMethod,
    selectedZone?.feePerRit || 0
  );

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateOrderInput({
      customerName,
      customerPhone,
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : 'Ambil Sendiri di Wangar Makmur',
      deliveryDistrict: deliveryMethod === 'delivery' ? selectedZone?.name : 'Nabire Barat',
      rit,
      paymentMethod,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      const firstErrorKey = Object.keys(validation.errors)[0];
      const el = document.getElementById(`input-${firstErrorKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Create order via storageService which enforces official prices
      const newOrder = storageService.createOrder({
        customerName,
        customerPhone,
        customerEmail,
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : 'Ambil Sendiri di Quarry Wangar Makmur',
        deliveryDistrict: deliveryMethod === 'delivery' ? selectedZone?.name : 'Nabire Barat (Quarry CV KAMINDIPMAN)',
        deliveryNotes,
        items: [
          {
            productId: selectedProduct.id,
            rit,
          },
        ],
        shippingZoneId: deliveryMethod === 'delivery' ? selectedZone.id : undefined,
        paymentMethod,
      });

      setIsSubmitting(false);
      onOrderSuccess(newOrder);

      // Branch behavior based on payment method
      if (paymentMethod === 'online') {
        onOpenPaymentModal(newOrder);
      } else if (paymentMethod === 'whatsapp') {
        const msg = generateWhatsAppOrderMessage({
          customerName: newOrder.customerName,
          customerPhone: newOrder.customerPhone,
          materialName: selectedProduct.name,
          rit: newOrder.items[0].rit,
          pricePerRit: selectedProduct.pricePerRit,
          totalAmount: newOrder.totalAmount,
          deliveryAddress: newOrder.deliveryAddress,
          deliveryDistrict: newOrder.deliveryDistrict,
          paymentMethod: newOrder.paymentMethod,
          orderCode: newOrder.orderCode,
        });
        const url = generateWhatsAppDirectUrl(settings.adminWhatsApp, msg);
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch {
      setIsSubmitting(false);
      alert('Terjadi kesalahan saat memproses pesanan. Silakan coba kembali atau hubungi WhatsApp admin.');
    }
  };

  return (
    <section className="py-12 bg-zinc-100 text-zinc-900" id="form-pemesanan">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Formulir Pemesanan & Kalkulator Otomatis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Pesan Material Bangunan CV KAMINDIPMAN
          </h2>
          <p className="text-sm text-zinc-600 mt-2">
            Hitung total biaya secara transparan sesuai jumlah rit dump truck dan wilayah pengiriman di Nabire.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Steps 1 to 8 */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1 & 2: Pilih Jenis Material & Lihat Harga Resmi */}
            <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <h3 className="font-bold text-base text-zinc-900">
                  Pilih Jenis Material Bangunan
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.map((prod) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => setSelectedProductId(prod.id)}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      selectedProductId === prod.id
                        ? 'border-orange-600 bg-orange-50/60 ring-2 ring-orange-600/30'
                        : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'
                    }`}
                  >
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-14 h-14 rounded-lg object-cover shrink-0 border border-zinc-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-zinc-900 truncate">
                        {prod.name}
                      </div>
                      <div className="text-xs text-orange-600 font-bold font-mono mt-0.5">
                        {formatRupiah(prod.pricePerRit)} <span className="text-zinc-500 font-normal">/ rit</span>
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate mt-1">
                        {prod.unit}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Pilih Jumlah Rit */}
            <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h3 className="font-bold text-base text-zinc-900">
                  Pilih Jumlah Rit Pesanan
                </h3>
              </div>

              <div>
                <p className="text-xs text-zinc-600 mb-2">
                  Pilih cepat tombol di bawah atau ketik jumlah rit yang diinginkan:
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[1, 2, 3, 5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRit(num)}
                      className={`flex-1 min-w-[65px] py-2.5 rounded-lg text-xs font-bold transition-colors ${
                        rit === num
                          ? 'bg-zinc-900 text-white'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      {num} Rit
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <label className="text-xs font-semibold text-zinc-700">
                    Input manual jumlah rit:
                  </label>
                  <input
                    id="input-rit"
                    type="number"
                    min="1"
                    max="100"
                    value={rit}
                    onChange={(e) => setRit(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 px-3 py-1.5 border border-zinc-300 rounded-lg text-sm font-bold text-center text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-xs text-zinc-500">Rit (Dump Truck)</span>
                </div>
                {errors.rit && <p className="text-xs text-red-600 mt-1">{errors.rit}</p>}
              </div>
            </div>

            {/* Step 4 & 5: Data Pelanggan */}
            <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <h3 className="font-bold text-base text-zinc-900">
                  Data Pemesan & Kontak
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Nama Lengkap / Instansi / Kontraktor: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-customerName"
                    type="text"
                    placeholder="Contoh: Bpk. Yohanes Pigai / PT Mandiri"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.customerName && (
                    <p className="text-xs text-red-600 mt-1">{errors.customerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Nomor WhatsApp Aktif: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-customerPhone"
                    type="tel"
                    placeholder="Contoh: 081240987654"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.customerPhone && (
                    <p className="text-xs text-red-600 mt-1">{errors.customerPhone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1">
                  Email (Opsional untuk bukti invoice PDF):
                </label>
                <input
                  type="email"
                  placeholder="Contoh: yohanes@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Step 6 & 7: Metode Pengiriman & Lokasi di Nabire */}
            <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <h3 className="font-bold text-base text-zinc-900">
                  Metode Pengambilan & Alamat Pengiriman
                </h3>
              </div>

              {/* Delivery method toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-colors ${
                    deliveryMethod === 'delivery'
                      ? 'border-orange-600 bg-orange-50 text-orange-950 font-bold'
                      : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  <Truck className="w-4 h-4 text-orange-600 shrink-0" />
                  <div className="text-xs">
                    <div className="font-bold">Kirim ke Lokasi Proyek</div>
                    <div className="text-[11px] text-zinc-500">Diantar dump truck CV KAMINDIPMAN</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-colors ${
                    deliveryMethod === 'pickup'
                      ? 'border-orange-600 bg-orange-50 text-orange-950 font-bold'
                      : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                  <div className="text-xs">
                    <div className="font-bold">Ambil Sendiri di Quarry</div>
                    <div className="text-[11px] text-zinc-500">Kampung Wangar Makmur (Ongkir Rp 0)</div>
                  </div>
                </button>
              </div>

              {deliveryMethod === 'delivery' ? (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Pilih Wilayah / Distrik Pengiriman di Nabire: <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="input-deliveryDistrict"
                      value={shippingZoneId}
                      onChange={(e) => setShippingZoneId(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {shippingZones
                        .filter((z) => z.id !== 'zone_pickup')
                        .map((zone) => (
                          <option key={zone.id} value={zone.id}>
                            {zone.name} — {formatRupiah(zone.feePerRit)} / rit ({zone.estimatedTime})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Alamat Lengkap / Patokan Lokasi Bongkar: <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="input-deliveryAddress"
                      rows={2}
                      placeholder="Contoh: Jl. Poros Kalibobo No. 24, Depan Gereja / Samping Kantor Kelurahan"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.deliveryAddress && (
                      <p className="text-xs text-red-600 mt-1">{errors.deliveryAddress}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-xs text-zinc-600 space-y-1">
                  <div className="font-bold text-zinc-800">Alamat Titik Muat / Quarry:</div>
                  <p>{settings.quarryLocation}</p>
                  <p className="text-[11px] text-zinc-500">
                    Jam Operasional Pengambilan: {settings.operationalHours}
                  </p>
                </div>
              )}

              {/* Kolom catatan tambahan */}
              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1">
                  Catatan Tambahan untuk Sopir / Mandor (Opsional):
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Gang agak sempit, tolong gunakan sopir yang hafal area."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Step 8: Metode Pembayaran (Online, COD, WhatsApp) */}
            <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                  5
                </span>
                <h3 className="font-bold text-base text-zinc-900">
                  Pilih Metode Pembayaran
                </h3>
              </div>

              <div className="space-y-3">
                {/* Option A: Pembayaran Online (Midtrans/Xendit) */}
                <label
                  className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'online'
                      ? 'border-orange-600 bg-orange-50/50 ring-1 ring-orange-500/50'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="mt-1 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-orange-600" />
                      <span className="font-bold text-sm text-zinc-900">
                        A. Pembayaran Online Otomatis
                      </span>
                      <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded">
                        Midtrans / Xendit QRIS & VA
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      Bayar instan menggunakan QRIS (semua e-wallet & mobile banking) atau Virtual Account BCA, BRI, Mandiri, BNI. Status pembayaran otomatis terverifikasi.
                    </p>
                  </div>
                </label>

                {/* Option B: COD (Cash on Delivery) */}
                <label
                  className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-orange-600 bg-orange-50/50 ring-1 ring-orange-500/50'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-orange-600" />
                      <span className="font-bold text-sm text-zinc-900">
                        B. COD (Cash On Delivery)
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      Pesan sekarang di website, bayar tunai kepada sopir dump truck atau perwakilan CV KAMINDIPMAN saat material tiba dan diperiksa di lokasi.
                    </p>
                  </div>
                </label>

                {/* Option C: Pembayaran Melalui WhatsApp */}
                <label
                  className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'whatsapp'
                      ? 'border-orange-600 bg-orange-50/50 ring-1 ring-orange-500/50'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="whatsapp"
                    checked={paymentMethod === 'whatsapp'}
                    onChange={() => setPaymentMethod('whatsapp')}
                    className="mt-1 text-orange-600 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-sm text-zinc-900">
                        C. Pembayaran & Konfirmasi via WhatsApp
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      Hubungi admin CV KAMINDIPMAN via WhatsApp untuk negosiasi jadwal, termin pembayaran proyek, atau kesepakatan kontrak pengadaan material.
                    </p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Step 9 & 10 (Rincian Total Pesanan & Konfirmasi) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-white rounded-xl p-6 border border-zinc-200 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                <h3 className="font-extrabold text-lg text-zinc-900">
                  Rincian Total Pesanan
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-700">
                  Kalkulasi Otomatis
                </span>
              </div>

              {/* Material Detail */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-zinc-900">{selectedProduct?.name}</div>
                    <div className="text-xs text-zinc-500">
                      {rit} rit × {formatRupiah(selectedProduct?.pricePerRit || 0)}
                    </div>
                  </div>
                  <span className="font-bold font-mono text-zinc-900">
                    {formatRupiah(calculation.subtotalMaterial)}
                  </span>
                </div>

                {/* Delivery Fee */}
                <div className="flex justify-between items-start pt-2 border-t border-zinc-100">
                  <div>
                    <div className="font-semibold text-zinc-800">Biaya Pengiriman Dump Truck:</div>
                    <div className="text-xs text-zinc-500">
                      {deliveryMethod === 'delivery'
                        ? `${selectedZone?.name} (${rit} rit × ${formatRupiah(selectedZone?.feePerRit || 0)})`
                        : 'Ambil Sendiri di Quarry Wangar Makmur'}
                    </div>
                  </div>
                  <span className="font-bold font-mono text-zinc-900">
                    {formatRupiah(calculation.shippingFee)}
                  </span>
                </div>

                {/* Total grand amount */}
                <div className="p-4 bg-zinc-900 text-white rounded-xl space-y-1">
                  <div className="text-xs text-zinc-400">TOTAL HARGA PESANAN:</div>
                  <div className="text-2xl sm:text-3xl font-black text-orange-400 font-mono tracking-tight">
                    {formatRupiah(calculation.grandTotal)}
                  </div>
                  <div className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800 flex justify-between">
                    <span>Total Volume: {rit} Rit Dump Truck</span>
                    <span>Metode: {paymentMethod.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Security & Guarantee Trust Note */}
              <div className="bg-zinc-50 rounded-lg p-3 text-xs text-zinc-600 space-y-1 border border-zinc-200">
                <div className="flex items-center gap-1.5 font-bold text-zinc-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Jaminan Resmi CV KAMINDIPMAN:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Pesanan akan dibuatkan Kode Transaksi Unik dan Bukti Nota Resmi. Harga material dijamin sesuai harga resmi perusahaan di Nabire.
                </p>
              </div>

              {/* Submit Confirmation Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-black text-base rounded-xl shadow-lg hover:shadow-orange-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Memproses Pesanan...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Konfirmasi & Kirim Pesanan</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <a
                  href={`https://wa.me/${settings.adminWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-emerald-600 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Ada pertanyaan sebelum pesan? Hubungi WhatsApp Admin</span>
                </a>
              </div>

            </div>
          </div>

        </form>

      </div>
    </section>
  );
};
