import React, { useState, useEffect, useMemo } from 'react';
import { 
  History, 
  Search, 
  FileText, 
  Truck, 
  RotateCcw, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  Package, 
  MapPin, 
  ArrowRight, 
  Filter, 
  ShieldCheck, 
  AlertCircle,
  Copy,
  Check,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Star
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { storageService } from '../services/storageService';
import { formatRupiah, generateWhatsAppDirectUrl } from '../utils/orderCalculator';
import { ORDER_STATUS_LABELS } from './OrderTracking';

interface CustomerOrderHistoryProps {
  onOpenInvoice: (order: Order) => void;
  onTrackOrder: (orderCode: string) => void;
  onReorder: (productId: string, rit: number) => void;
  onGoToOrder: () => void;
  adminWhatsApp: string;
  onWriteReview?: (orderCode: string) => void;
}

export const CustomerOrderHistory: React.FC<CustomerOrderHistoryProps> = ({
  onOpenInvoice,
  onTrackOrder,
  onReorder,
  onGoToOrder,
  adminWhatsApp,
  onWriteReview,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Auto-load orders from storageService and listen for updates
  useEffect(() => {
    const loadOrders = () => {
      setOrders(storageService.getOrders());
    };

    loadOrders();
    const unsubscribe = storageService.subscribe((scope) => {
      if (scope === 'orders' || scope === 'reset' || scope === 'all') {
        loadOrders();
      }
    });

    return () => unsubscribe();
  }, []);

  // Filtered orders logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Status Filter
      if (activeStatusFilter === 'active') {
        if (!['pesanan_masuk', 'menunggu_konfirmasi', 'menunggu_pembayaran', 'pembayaran_berhasil', 'pesanan_diproses', 'dalam_pengiriman'].includes(order.orderStatus)) {
          return false;
        }
      } else if (activeStatusFilter === 'selesai') {
        if (order.orderStatus !== 'pesanan_selesai') return false;
      } else if (activeStatusFilter === 'menunggu_pembayaran') {
        if (order.paymentStatus !== 'pending' && order.paymentStatus !== 'cod_pending') return false;
      }

      // 2. Search Query (Order code, Customer name, Phone, District, or Product name)
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;

      const matchCode = order.orderCode.toLowerCase().includes(query);
      const matchName = order.customerName.toLowerCase().includes(query);
      const matchPhone = order.customerPhone.replace(/\D/g, '').includes(query.replace(/\D/g, ''));
      const matchDistrict = order.deliveryDistrict.toLowerCase().includes(query);
      const matchProduct = order.items.some(item => item.productName.toLowerCase().includes(query));

      return matchCode || matchName || matchPhone || matchDistrict || matchProduct;
    });
  }, [orders, activeStatusFilter, searchQuery]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    let totalRit = 0;
    let totalSpend = 0;
    let activeOrdersCount = 0;

    orders.forEach((order) => {
      if (order.orderStatus !== 'pesanan_dibatalkan') {
        totalSpend += order.totalAmount;
        order.items.forEach((item) => {
          totalRit += item.rit;
        });

        if (['pesanan_masuk', 'menunggu_konfirmasi', 'menunggu_pembayaran', 'pembayaran_berhasil', 'pesanan_diproses', 'dalam_pengiriman'].includes(order.orderStatus)) {
          activeOrdersCount++;
        }
      }
    });

    return {
      totalOrders: orders.length,
      totalRit,
      totalSpend,
      activeOrdersCount,
    };
  }, [orders]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const handleContactAdminForOrder = (order: Order) => {
    const msg = `Halo CV KAMINDIPMAN, saya ingin menanyakan perihal transaksi material saya dengan Kode: ${order.orderCode} atas nama ${order.customerName}.`;
    const url = generateWhatsAppDirectUrl(adminWhatsApp, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-12 bg-zinc-50 min-h-[700px] text-zinc-900" id="riwayat-pesanan">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-100 border border-orange-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Arsip & Riwayat Transaksi Pelanggan</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
                Riwayat Pesanan Material
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                Daftar lengkap seluruh transaksi material galian C Anda di CV KAMINDIPMAN. Pantau progres pengiriman, unduh nota resmi, atau pesan ulang material.
              </p>
            </div>
            <button
              onClick={onGoToOrder}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all self-start md:self-auto cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Pesan Material Baru</span>
            </button>
          </div>
        </div>

        {/* Customer Metrics Overview Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-1">
              <span className="text-xs font-semibold text-zinc-500">Total Transaksi</span>
              <Package className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-black text-zinc-900 font-mono">
              {metrics.totalOrders}
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Pesanan tercatat di sistem</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-1">
              <span className="text-xs font-semibold text-zinc-500">Volume Rit Dipesan</span>
              <Layers className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-black text-orange-600 font-mono">
              {metrics.totalRit} <span className="text-xs font-bold text-zinc-700">Rit</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Dump truck ±4-5 m³</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-1">
              <span className="text-xs font-semibold text-zinc-500">Total Nilai Material</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-zinc-900 font-mono truncate">
              {formatRupiah(metrics.totalSpend)}
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Akumulasi pengadaan</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-1">
              <span className="text-xs font-semibold text-zinc-500">Pesanan Aktif</span>
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-black text-zinc-900 font-mono flex items-center gap-1.5">
              <span>{metrics.activeOrdersCount}</span>
              {metrics.activeOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              )}
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Dalam muat / perjalanan</div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm mb-6 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kode pesanan (KMD-...), nama pemesan, no HP, atau lokasi..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-zinc-50 border border-zinc-300 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-700 cursor-pointer"
                >
                  Hapus
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
              <button
                onClick={() => setActiveStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  activeStatusFilter === 'all'
                    ? 'bg-zinc-900 border-zinc-900 text-white font-bold'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Semua ({orders.length})
              </button>
              <button
                onClick={() => setActiveStatusFilter('active')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  activeStatusFilter === 'active'
                    ? 'bg-orange-600 border-orange-600 text-white font-bold'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Sedang Berjalan ({metrics.activeOrdersCount})
              </button>
              <button
                onClick={() => setActiveStatusFilter('selesai')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  activeStatusFilter === 'selesai'
                    ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Selesai
              </button>
              <button
                onClick={() => setActiveStatusFilter('menunggu_pembayaran')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  activeStatusFilter === 'menunggu_pembayaran'
                    ? 'bg-amber-600 border-amber-600 text-white font-bold'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Belum Lunas / COD
              </button>
            </div>

          </div>
        </div>

        {/* Orders List Grid */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusInfo = ORDER_STATUS_LABELS[order.orderStatus];
              const isPaid = order.paymentStatus === 'paid';
              const isCOD = order.paymentStatus === 'cod_pending';
              const totalRit = order.items.reduce((acc, curr) => acc + curr.rit, 0);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all overflow-hidden"
                >
                  {/* Top Bar of the Card */}
                  <div className="bg-zinc-900 p-4 sm:px-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-orange-400 text-sm sm:text-base">
                          {order.orderCode}
                        </span>
                        <button
                          onClick={() => handleCopyCode(order.orderCode)}
                          className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          title="Salin Kode Pesanan"
                        >
                          {copiedCode === order.orderCode ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <span className="text-zinc-600 hidden sm:inline">•</span>

                      <div className="text-xs text-zinc-300 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span>
                          {new Date(order.createdAt).toLocaleString('id-ID', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}{' '}
                          WIT
                        </span>
                      </div>
                    </div>

                    {/* Status badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        isPaid
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          : isCOD
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}>
                        {isPaid ? 'Lunas' : isCOD ? 'COD di Tempat' : 'Menunggu Bayar'}
                      </span>
                    </div>
                  </div>

                  {/* Body: Materials & Delivery Info */}
                  <div className="p-4 sm:p-6 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left: Material Items List (7 cols) */}
                      <div className="lg:col-span-7 space-y-3">
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                          Material yang Dipesan ({totalRit} Rit)
                        </div>

                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-orange-700 text-xs shrink-0">
                                  {item.rit} Rit
                                </div>
                                <div>
                                  <div className="font-bold text-xs sm:text-sm text-zinc-900">
                                    {item.productName}
                                  </div>
                                  <div className="text-[11px] text-zinc-500 font-mono">
                                    Harga: {formatRupiah(item.pricePerRit)} / rit
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-mono font-bold text-xs sm:text-sm text-zinc-900">
                                  {formatRupiah(item.subtotal)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Operational Notice / Subtitle */}
                        <div className="text-xs text-zinc-500 flex items-center gap-1.5 pt-1">
                          <Truck className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                          <span>{statusInfo.desc}</span>
                        </div>
                      </div>

                      {/* Right: Location & Financial Summary (5 cols) */}
                      <div className="lg:col-span-5 bg-zinc-50/70 p-4 rounded-xl border border-zinc-200 flex flex-col justify-between space-y-3">
                        <div className="space-y-2 text-xs">
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-orange-600 mt-0.5 shrink-0" />
                            <div>
                              <div className="font-bold text-zinc-900">
                                {order.customerName} ({order.deliveryDistrict})
                              </div>
                              <div className="text-zinc-600 text-[11px] leading-relaxed mt-0.5">
                                {order.deliveryAddress}
                              </div>
                            </div>
                          </div>

                          {order.deliveryNotes && (
                            <div className="text-[11px] text-zinc-500 italic pl-5">
                              Catatan: "{order.deliveryNotes}"
                            </div>
                          )}
                        </div>

                        {/* Price Calculation Row */}
                        <div className="pt-2 border-t border-zinc-200 space-y-1 text-xs">
                          <div className="flex justify-between text-zinc-600">
                            <span>Subtotal Material:</span>
                            <span className="font-mono">{formatRupiah(order.subtotalMaterial)}</span>
                          </div>
                          <div className="flex justify-between text-zinc-600">
                            <span>Ongkir Dump Truck:</span>
                            <span className="font-mono">{formatRupiah(order.shippingFee)}</span>
                          </div>
                          <div className="flex justify-between items-center pt-1.5 border-t border-zinc-300 font-bold text-zinc-900">
                            <span className="text-xs uppercase tracking-wider">Total Pembayaran:</span>
                            <span className="font-mono text-base font-black text-orange-600">
                              {formatRupiah(order.totalAmount)}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Action Buttons Toolbar */}
                    <div className="pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {/* 1. Download / Open Invoice Button */}
                        <button
                          onClick={() => onOpenInvoice(order)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-orange-400" />
                          <span>Unduh / Cetak Nota</span>
                        </button>

                        {/* 2. Track Order Button */}
                        <button
                          onClick={() => onTrackOrder(order.orderCode)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Lacak Progres Stepper</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* 3. Reorder Material Button */}
                        <button
                          onClick={() => {
                            if (order.items.length > 0) {
                              onReorder(order.items[0].productId, order.items[0].rit);
                            } else {
                              onGoToOrder();
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-zinc-600" />
                          <span>Pesan Ulang</span>
                        </button>

                        {/* 4. WhatsApp Help */}
                        <button
                          onClick={() => handleContactAdminForOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                          title="Tanyakan ke WhatsApp Admin"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Tanya WA</span>
                        </button>

                        {/* 5. Review & Rating Button for Completed Orders */}
                        {order.orderStatus === 'pesanan_selesai' && onWriteReview && (
                          <button
                            onClick={() => onWriteReview(order.orderCode)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl shadow transition-colors cursor-pointer"
                            title="Beri Ulasan dan Rating 1-5 Bintang untuk pesanan ini"
                          >
                            <Star className="w-3.5 h-3.5 fill-zinc-950 text-zinc-950" />
                            <span>Beri Ulasan & Rating</span>
                          </button>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search / No Orders State */
          <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 mx-auto">
              <History className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-zinc-900">
                Tidak Ada Riwayat Pesanan Ditemukan
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto mt-1">
                {searchQuery || activeStatusFilter !== 'all'
                  ? 'Tidak ada pesanan yang cocok dengan kriteria pencarian atau filter status yang Anda pilih.'
                  : 'Anda belum memiliki riwayat pemesanan material di CV KAMINDIPMAN.'}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {(searchQuery || activeStatusFilter !== 'all') && (
                <button
                  onClick={() => { setSearchQuery(''); setActiveStatusFilter('all'); }}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Reset Filter Pencarian
                </button>
              )}
              <button
                onClick={onGoToOrder}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Truck className="w-4 h-4" />
                <span>Mulai Pesan Material</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Guarantee Banner */}
        <div className="mt-12 bg-zinc-900 text-white rounded-2xl p-6 sm:p-8 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>Arsip Legalitas & Administrasi Proyek</span>
            </div>
            <h4 className="text-base sm:text-lg font-black text-white">
              Butuh Rekapitulasi Invoice atau Surat Penawaran Resmi?
            </h4>
            <p className="text-xs text-zinc-400 max-w-xl">
              Kami siap menerbitkan bukti pengeluaran berkala, Surat Perjanjian Kerja (SPK), atau rekap ritase dump truck untuk SPJ proyek APBD/BUMN di Nabire.
            </p>
          </div>

          <a
            href={`https://wa.me/${adminWhatsApp}?text=${encodeURIComponent('Halo CV KAMINDIPMAN, kami dari kontraktor ingin berkonsultasi mengenai rekapitulasi riwayat pesanan material dan invoice resmi.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-colors shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Hubungi Administrasi WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
