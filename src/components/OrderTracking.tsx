import React from 'react';
import { 
  Search, 
  Package, 
  Clock, 
  CheckCircle, 
  CheckCircle2,
  Truck, 
  MapPin, 
  FileText, 
  AlertCircle,
  Phone,
  MessageCircle,
  PackageCheck,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  XCircle,
  ExternalLink,
  Star
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatRupiah, generateWhatsAppDirectUrl } from '../utils/orderCalculator';
import { storageService } from '../services/storageService';

interface OrderTrackingProps {
  initialOrderCode?: string;
  onOpenInvoice: (order: Order) => void;
  adminWhatsApp: string;
  onWriteReview?: (orderCode: string) => void;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, { label: string; desc: string; color: string }> = {
  pesanan_masuk: {
    label: '1. Pesanan Masuk',
    desc: 'Pesanan telah diterima oleh sistem CV KAMINDIPMAN.',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  menunggu_konfirmasi: {
    label: '2. Menunggu Konfirmasi',
    desc: 'Admin & mandor quarry sedang memverifikasi jadwal armada.',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  menunggu_pembayaran: {
    label: '3. Menunggu Pembayaran',
    desc: 'Menunggu pelunasan via payment gateway online atau COD.',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  pembayaran_berhasil: {
    label: '4. Pembayaran Berhasil',
    desc: 'Dana terkonfirmasi lunas oleh sistem CV KAMINDIPMAN.',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  pesanan_diproses: {
    label: '5. Pesanan Diproses',
    desc: 'Material sedang dimuat dump truck di quarry Wangar Makmur.',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  dalam_pengiriman: {
    label: '6. Dalam Pengiriman',
    desc: 'Dump truck dalam perjalanan menuju lokasi proyek di Nabire.',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
  },
  pesanan_selesai: {
    label: '7. Pesanan Selesai',
    desc: 'Material telah dibongkar di lokasi dan diterima dengan baik.',
    color: 'bg-green-100 text-green-800 border-green-300',
  },
  pesanan_dibatalkan: {
    label: '8. Pesanan Dibatalkan',
    desc: 'Pesanan dibatalkan atas kesepakatan pembeli atau kendala armada.',
    color: 'bg-red-100 text-red-800 border-red-300',
  },
};

// 4 Primary Visual Stepper Milestones requested:
// Pesanan Masuk -> Diproses -> Dalam Pengiriman -> Selesai
export interface VisualStepperStage {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  mappedStatuses: OrderStatus[];
}

const VISUAL_STEPPER_STAGES: VisualStepperStage[] = [
  {
    id: 'stage_masuk',
    stepNumber: 1,
    title: 'Pesanan Masuk',
    subtitle: 'Tercatat di sistem',
    icon: PackageCheck,
    mappedStatuses: ['pesanan_masuk', 'menunggu_konfirmasi'],
  },
  {
    id: 'stage_proses',
    stepNumber: 2,
    title: 'Diproses',
    subtitle: 'Muat di Kuari Wangar',
    icon: Layers,
    mappedStatuses: ['menunggu_pembayaran', 'pembayaran_berhasil', 'pesanan_diproses'],
  },
  {
    id: 'stage_kirim',
    stepNumber: 3,
    title: 'Dalam Pengiriman',
    subtitle: 'Dump truck meluncur',
    icon: Truck,
    mappedStatuses: ['dalam_pengiriman'],
  },
  {
    id: 'stage_selesai',
    stepNumber: 4,
    title: 'Selesai',
    subtitle: 'Material tiba di proyek',
    icon: CheckCircle2,
    mappedStatuses: ['pesanan_selesai'],
  },
];

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  initialOrderCode = '',
  onOpenInvoice,
  adminWhatsApp,
  onWriteReview,
}) => {
  const [searchInput, setSearchInput] = React.useState(initialOrderCode);
  const [searchedOrder, setSearchedOrder] = React.useState<Order | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [recentOrders, setRecentOrders] = React.useState<Order[]>([]);

  React.useEffect(() => {
    // Load recent orders from storage
    const all = storageService.getOrders();
    setRecentOrders(all.slice(0, 5));

    if (initialOrderCode) {
      const match = storageService.getOrderByCode(initialOrderCode);
      if (match) {
        setSearchedOrder(match);
        setHasSearched(true);
      }
    }
  }, [initialOrderCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const found = storageService.getOrderByCode(searchInput.trim());
    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const handleSelectRecent = (order: Order) => {
    setSearchInput(order.orderCode);
    setSearchedOrder(order);
    setHasSearched(true);
  };

  const handleContactAdminForOrder = (order: Order) => {
    const msg = `Halo CV KAMINDIPMAN, saya ingin menanyakan status pesanan saya dengan Kode Transaksi: ${order.orderCode} atas nama ${order.customerName}.`;
    const url = generateWhatsAppDirectUrl(adminWhatsApp, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Determine current active milestone index (0 to 3) and progress percentage
  const getStepperStatus = (status: OrderStatus) => {
    if (status === 'pesanan_dibatalkan') {
      return {
        stageIndex: -1,
        progressPercent: 0,
        isCancelled: true,
        currentStage: null,
      };
    }

    let stageIndex = 0;
    if (['pesanan_masuk', 'menunggu_konfirmasi'].includes(status)) {
      stageIndex = 0;
    } else if (['menunggu_pembayaran', 'pembayaran_berhasil', 'pesanan_diproses'].includes(status)) {
      stageIndex = 1;
    } else if (status === 'dalam_pengiriman') {
      stageIndex = 2;
    } else if (status === 'pesanan_selesai') {
      stageIndex = 3;
    }

    // Dynamic progress bar fill calculation for the line between 4 milestones
    // 0: 0% / 12%, 1: 37%, 2: 70%, 3: 100%
    const progressMap: Record<number, number> = {
      0: status === 'menunggu_konfirmasi' ? 18 : 10,
      1: status === 'pesanan_diproses' ? 48 : 36,
      2: 72,
      3: 100,
    };

    return {
      stageIndex,
      progressPercent: progressMap[stageIndex] || 0,
      isCancelled: false,
      currentStage: VISUAL_STEPPER_STAGES[stageIndex],
    };
  };

  const stepperInfo = searchedOrder ? getStepperStatus(searchedOrder.orderStatus) : null;

  return (
    <section className="py-12 bg-zinc-50 min-h-[600px] text-zinc-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Search className="w-3.5 h-3.5" />
            <span>Lacak Status Pengiriman & Pembayaran</span>
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            Cek Status Pesanan Material
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1">
            Masukkan Nomor Pesanan (Contoh: <code className="font-mono text-orange-600 font-bold">KMD-202611-1029</code>) atau Nomor WhatsApp yang terdaftar.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="bg-white p-2 rounded-2xl border border-zinc-300 shadow-md flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-zinc-400 absolute left-4" />
              <input
                type="text"
                placeholder="Masukkan Kode Pesanan atau No HP Pemesan..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none rounded-xl"
              />
            </div>
            <button
              type="submit"
              className="py-3 px-6 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Search className="w-4 h-4" />
              <span>Cari Pesanan</span>
            </button>
          </div>
        </form>

        {/* Quick sample chips */}
        {recentOrders.length > 0 && !hasSearched && (
          <div className="mb-10 text-center">
            <span className="text-xs text-zinc-500 mr-2">Contoh transaksi tersimpan:</span>
            <div className="inline-flex flex-wrap gap-1.5 mt-2 justify-center">
              {recentOrders.map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => handleSelectRecent(ord)}
                  className="px-2.5 py-1 bg-white border border-zinc-200 hover:border-orange-500 text-xs font-mono rounded text-zinc-700 transition-colors cursor-pointer"
                >
                  {ord.orderCode} ({ord.customerName})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Display */}
        {hasSearched && (
          <div>
            {searchedOrder && stepperInfo ? (
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-lg overflow-hidden space-y-6">
                
                {/* Order Header Banner */}
                <div className="bg-zinc-950 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                      <span>Kode Transaksi Resmi CV KAMINDIPMAN</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                    </div>
                    <div className="text-2xl font-black font-mono tracking-tight text-orange-400 mt-0.5">
                      {searchedOrder.orderCode}
                    </div>
                    <div className="text-xs text-zinc-300 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>
                        Waktu Pemesanan: {new Date(searchedOrder.createdAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })} WIT
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onOpenInvoice(searchedOrder)}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-orange-400" />
                      <span>Cetak Nota / Invoice</span>
                    </button>
                    <button
                      onClick={() => handleContactAdminForOrder(searchedOrder)}
                      className="px-3.5 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Tanya Admin</span>
                    </button>
                  </div>
                </div>

                <div className="px-6 space-y-6">
                  
                  {/* Current Status Highlight Card */}
                  <div className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50 border-zinc-200">
                    <div>
                      <div className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        <span>Status Operasional Terkini:</span>
                      </div>
                      <div className="text-lg font-extrabold text-zinc-900 mt-0.5 flex items-center gap-2">
                        <span>{ORDER_STATUS_LABELS[searchedOrder.orderStatus].label}</span>
                      </div>
                      <p className="text-xs text-zinc-600 mt-0.5">
                        {ORDER_STATUS_LABELS[searchedOrder.orderStatus].desc}
                      </p>
                    </div>

                    <div className="flex flex-col items-start sm:items-end">
                      <div className="text-xs font-semibold text-zinc-500">Status Pembayaran:</div>
                      <span className={`px-2.5 py-1 rounded text-xs font-bold mt-1 ${
                        searchedOrder.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : searchedOrder.paymentStatus === 'cod_pending'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-zinc-200 text-zinc-800'
                      }`}>
                        {searchedOrder.paymentStatus === 'paid' && 'Lunas (Terverifikasi)'}
                        {searchedOrder.paymentStatus === 'cod_pending' && 'Menunggu Pembayaran COD di Tempat'}
                        {searchedOrder.paymentStatus === 'pending' && 'Menunggu Pembayaran'}
                        {searchedOrder.paymentStatus === 'failed' && 'Gagal'}
                      </span>
                    </div>
                  </div>

                  {/* VISUAL STEPPER & PROGRESS BAR SECTION */}
                  {stepperInfo.isCancelled ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-900 text-xs">
                      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-sm text-red-700">Pesanan Dibatalkan</div>
                        <p className="mt-0.5 text-red-800/90 leading-relaxed">
                          Pesanan material ini berstatus dibatalkan. Jika Anda ingin melakukan pemesanan ulang atau membutuhkan bantuan, silakan hubungi tim administrasi kami.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-zinc-900 text-white p-6 rounded-2xl border border-zinc-800 shadow-inner relative overflow-hidden">
                      {/* Section label */}
                      <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-800">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                          <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase">
                            Progres Alur Pengiriman Material
                          </h4>
                        </div>
                        <div className="text-xs text-orange-400 font-semibold font-mono">
                          Tahap {stepperInfo.stageIndex + 1} dari 4
                        </div>
                      </div>

                      {/* Visual Stepper Bar Container */}
                      <div className="relative pt-2 pb-4">
                        
                        {/* Connecting Background Line */}
                        <div className="absolute top-8 left-8 right-8 sm:left-12 sm:right-12 h-1.5 bg-zinc-800 rounded-full -translate-y-1/2 z-0" />
                        
                        {/* Connecting Active Filled Progress Line */}
                        <div 
                          className="absolute top-8 left-8 sm:left-12 h-1.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full -translate-y-1/2 z-0 transition-all duration-700 ease-out"
                          style={{ 
                            width: `calc(${stepperInfo.progressPercent}% - 3rem)`,
                            maxWidth: 'calc(100% - 4rem)' 
                          }}
                        />

                        {/* 4 Stepper Node Points */}
                        <div className="grid grid-cols-4 gap-2 relative z-10">
                          {VISUAL_STEPPER_STAGES.map((stage, idx) => {
                            const isCompleted = idx < stepperInfo.stageIndex;
                            const isCurrent = idx === stepperInfo.stageIndex;
                            const isFuture = idx > stepperInfo.stageIndex;
                            const StageIcon = stage.icon;

                            return (
                              <div key={stage.id} className="flex flex-col items-center text-center group">
                                
                                {/* Stepper Circle Icon */}
                                <div
                                  className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center transition-all duration-300 relative ${
                                    isCurrent
                                      ? 'bg-orange-600 text-white ring-4 ring-orange-500/30 scale-105 shadow-lg shadow-orange-600/40'
                                      : isCompleted
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                  ) : (
                                    <StageIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${isCurrent ? 'animate-bounce-subtle' : ''}`} />
                                  )}

                                  {/* Active Glowing Pulse Dot */}
                                  {isCurrent && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
                                    </span>
                                  )}
                                </div>

                                {/* Step Title */}
                                <div className="mt-3">
                                  <div className={`text-xs sm:text-sm font-bold leading-tight ${
                                    isCurrent 
                                      ? 'text-orange-400' 
                                      : isCompleted 
                                      ? 'text-white' 
                                      : 'text-zinc-500'
                                  }`}>
                                    {stage.title}
                                  </div>
                                  <div className="hidden sm:block text-[11px] text-zinc-400 mt-0.5 leading-snug">
                                    {stage.subtitle}
                                  </div>
                                </div>

                                {/* Current Status Tag */}
                                {isCurrent && (
                                  <div className="mt-1.5 hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-950 border border-orange-500/40 text-orange-300">
                                    <span>Sedang Berjalan</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                      </div>

                      {/* Stepper Description Box */}
                      <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-orange-400 shrink-0" />
                          <span className="text-zinc-300">
                            <strong>Tahap Operasional:</strong> {ORDER_STATUS_LABELS[searchedOrder.orderStatus].desc}
                          </span>
                        </div>
                        <div className="text-zinc-400 text-[11px] shrink-0 font-mono">
                          Kuari: Wangar Makmur &rarr; {searchedOrder.deliveryDistrict}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Admin notes if present */}
                  {searchedOrder.adminNotes && (
                    <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-950 flex items-start gap-2.5">
                      <MessageCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-orange-900">Catatan Petugas Logistik Kuari:</strong>{' '}
                        <span>{searchedOrder.adminNotes}</span>
                      </div>
                    </div>
                  )}

                  {/* Order Details & Summary Grid */}
                  <div className="pt-2 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                    <div className="space-y-2.5">
                      <div className="font-bold text-zinc-900 text-sm flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        <span>Informasi Tujuan Pengiriman:</span>
                      </div>
                      
                      <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 space-y-1.5">
                        <div>
                          <span className="text-zinc-500">Nama Penerima:</span>{' '}
                          <strong className="text-zinc-900">{searchedOrder.customerName}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-500">Nomor WhatsApp / HP:</span>{' '}
                          <span className="font-mono text-zinc-800 font-semibold">{searchedOrder.customerPhone}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Wilayah / Distrik:</span>{' '}
                          <span className="text-zinc-800 font-medium">{searchedOrder.deliveryDistrict}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Alamat Lengkap:</span>{' '}
                          <span className="text-zinc-800">{searchedOrder.deliveryAddress}</span>
                        </div>
                        {searchedOrder.deliveryNotes && (
                          <div className="pt-1 border-t border-zinc-200/80 text-zinc-600 italic">
                            <span className="font-semibold not-italic text-zinc-700">Catatan Khusus:</span> "{searchedOrder.deliveryNotes}"
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <div className="font-bold text-zinc-900 text-sm flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-orange-600" />
                        <span>Rincian Muatan Material:</span>
                      </div>

                      <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 space-y-2">
                        {searchedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center border-b border-zinc-200/80 pb-1.5">
                            <div>
                              <div className="font-semibold text-zinc-900">{item.productName}</div>
                              <div className="text-[11px] text-zinc-500">Volume: {item.rit} rit dump truck (@ {formatRupiah(item.pricePerRit)})</div>
                            </div>
                            <span className="font-mono font-semibold text-zinc-800">{formatRupiah(item.subtotal)}</span>
                          </div>
                        ))}

                        <div className="flex justify-between text-zinc-600 text-[11px] pt-1">
                          <span>Ongkos Kirim Armada:</span>
                          <span className="font-mono font-medium">{formatRupiah(searchedOrder.shippingFee)}</span>
                        </div>

                        <div className="flex justify-between items-center font-bold text-zinc-900 pt-1.5 border-t border-zinc-300">
                          <span className="text-xs uppercase tracking-wider">Total Pembayaran:</span>
                          <span className="font-mono text-orange-600 font-extrabold text-base">
                            {formatRupiah(searchedOrder.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verified Review Callout when order is completed */}
                  {searchedOrder.orderStatus === 'pesanan_selesai' && onWriteReview && (
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
                          <Star className="w-5 h-5 fill-zinc-950" />
                        </div>
                        <div>
                          <div className="font-bold text-zinc-900 text-sm">Pesanan Anda Telah Selesai!</div>
                          <div className="text-zinc-600 text-[11px]">Bagikan ulasan dan rating 1-5 bintang mengenai mutu material Wangar Makmur & muatan rit dump truck kami.</div>
                        </div>
                      </div>
                      <button
                        onClick={() => onWriteReview(searchedOrder.orderCode)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs shadow transition-colors cursor-pointer whitespace-nowrap self-stretch sm:self-auto text-center"
                      >
                        Beri Ulasan & Rating ⭐
                      </button>
                    </div>
                  )}

                </div>

                {/* Footer Action Bar */}
                <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
                  <span className="text-zinc-500 text-center sm:text-left">
                    Butuh konfirmasi rute pengiriman dump truck atau penyesuaian jam bongkar?
                  </span>
                  <button
                    onClick={() => handleContactAdminForOrder(searchedOrder)}
                    className="font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Hubungi Mandor Logistik Nabire</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-orange-500 mx-auto" />
                <h3 className="font-bold text-lg text-zinc-900">
                  Pesanan Tidak Ditemukan
                </h3>
                <p className="text-xs text-zinc-600 max-w-md mx-auto">
                  Tidak ada transaksi yang cocok dengan pencarian <code className="font-mono font-bold text-zinc-800">"{searchInput}"</code>. Pastikan kode transaksi atau nomor WhatsApp yang Anda masukkan sudah benar.
                </p>
                <button
                  onClick={() => setSearchInput('')}
                  className="px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 cursor-pointer"
                >
                  Coba Cari Lagi
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
