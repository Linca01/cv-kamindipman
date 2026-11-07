import React from 'react';
import { 
  Bell, 
  X, 
  Phone, 
  FileText, 
  ArrowRight, 
  MapPin, 
  Truck, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  MessageCircle,
  Clock
} from 'lucide-react';
import { Order } from '../../types';
import { formatRupiah } from '../../utils/orderCalculator';

export interface ToastNotificationItem {
  id: string;
  order: Order;
  receivedAt: Date;
  progress: number; // 0 to 100
  isPaused: boolean;
}

interface OrderNotificationToastProps {
  toasts: ToastNotificationItem[];
  onDismiss: (toastId: string) => void;
  onViewOrder: (order: Order) => void;
  onOpenInvoice: (order: Order) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPauseToast: (toastId: string, isPaused: boolean) => void;
}

export const OrderNotificationToast: React.FC<OrderNotificationToastProps> = ({
  toasts,
  onDismiss,
  onViewOrder,
  onOpenInvoice,
  soundEnabled,
  onToggleSound,
  onPauseToast,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-3 max-w-md w-[calc(100vw-2rem)] sm:w-full pointer-events-none"
      aria-live="polite"
      aria-label="Notifikasi Pesanan Masuk Real-Time"
    >
      {toasts.map((toast) => {
        const order = toast.order;
        const totalRit = order.items.reduce((acc, item) => acc + item.rit, 0);
        
        // Clean phone number for WhatsApp URL (e.g. 082137238800 -> 6282137238800)
        let cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('0')) {
          cleanPhone = '62' + cleanPhone.slice(1);
        } else if (!cleanPhone.startsWith('62')) {
          cleanPhone = '62' + cleanPhone;
        }

        const materialList = order.items
          .map(i => `${i.productName} (${i.rit} Rit)`)
          .join(', ');

        const greetingMessage = encodeURIComponent(
          `Halo Bpk/Ibu ${order.customerName},\n\n` +
          `Kami dari CV KAMINDIPMAN Nabire mengonfirmasi bahwa pesanan material Anda telah kami terima:\n` +
          `• Kode Pesanan: ${order.orderCode}\n` +
          `• Material: ${materialList}\n` +
          `• Total: ${totalRit} Rit (${formatRupiah(order.totalAmount)})\n` +
          `• Tujuan: ${order.deliveryDistrict} (${order.deliveryAddress})\n` +
          `• Metode Pembayaran: ${order.paymentMethod === 'cod' ? 'COD (Bayar di Tempat)' : order.paymentMethod === 'whatsapp' ? 'WhatsApp Direct' : 'Transfer Online'}\n\n` +
          `Tim logistik kami sedang menyiapkan armada dump truck. Mohon konfirmasi akses jalan dan ketersediaan lokasi penumpukan material di lokasi Anda. Terima kasih!`
        );

        const waLink = `https://wa.me/${cleanPhone}?text=${greetingMessage}`;

        return (
          <div
            key={toast.id}
            onMouseEnter={() => onPauseToast(toast.id, true)}
            onMouseLeave={() => onPauseToast(toast.id, false)}
            className="pointer-events-auto bg-zinc-950 text-white rounded-2xl border-2 border-orange-500 shadow-2xl overflow-hidden transition-all duration-300 transform translate-y-0 animate-in slide-in-from-bottom-5"
            style={{
              boxShadow: '0 20px 35px -10px rgba(234, 88, 12, 0.4), 0 0 20px rgba(0, 0, 0, 0.8)',
            }}
          >
            {/* Top Bar with Pulsing Badge & Controls */}
            <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 px-4 py-2 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 fill-white" />
                  Pesanan Baru Masuk!
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onToggleSound}
                  title={soundEnabled ? 'Suara Chime Aktif (Klik untuk Matikan)' : 'Suara Chime Mati (Klik untuk Aktifkan)'}
                  className="p-1 hover:bg-white/20 rounded transition-colors text-white/90 hover:text-white cursor-pointer"
                  aria-label="Toggle Sound"
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-60" />}
                </button>
                <span className="text-[10px] text-orange-100 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {toast.receivedAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIT
                </span>
                <button
                  type="button"
                  onClick={() => onDismiss(toast.id)}
                  className="p-1 hover:bg-white/20 rounded-md transition-colors text-white cursor-pointer"
                  aria-label="Tutup Notifikasi"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-4 space-y-3">
              {/* Customer and District */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-base text-white tracking-tight flex items-center gap-1.5">
                    {order.customerName}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-orange-400 font-medium mt-0.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>Distrik {order.deliveryDistrict}</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-400 truncate max-w-[170px]" title={order.deliveryAddress}>
                      {order.deliveryAddress}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-orange-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                    {order.orderCode}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wider font-semibold">
                    {order.paymentMethod === 'cod' ? 'Bayar COD' : order.paymentMethod === 'whatsapp' ? 'WhatsApp' : 'Online'}
                  </div>
                </div>
              </div>

              {/* Order Items & Total Rit */}
              <div className="bg-zinc-900/90 rounded-xl p-2.5 border border-zinc-800 text-xs">
                <div className="flex items-center justify-between text-zinc-300 font-medium mb-1">
                  <span className="flex items-center gap-1.5 text-zinc-200 font-semibold">
                    <Truck className="w-3.5 h-3.5 text-orange-500" />
                    {totalRit} Rit Dump Truck
                  </span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">
                    {formatRupiah(order.totalAmount)}
                  </span>
                </div>
                <div className="text-zinc-400 text-[11px] line-clamp-2">
                  {materialList}
                </div>
                {order.deliveryNotes && (
                  <div className="mt-1 pt-1 border-t border-zinc-800/80 text-[10px] text-amber-300/90 italic">
                    Catatan: &ldquo;{order.deliveryNotes}&rdquo;
                  </div>
                )}
              </div>

              {/* Action Buttons to Respond Promptly */}
              <div className="pt-1 grid grid-cols-3 gap-2">
                {/* 1. Quick WhatsApp Response with Greeting Template */}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onDismiss(toast.id)}
                  className="col-span-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-2.5 rounded-xl shadow flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                  title="Respon Cepat via WhatsApp dengan Pesan Konfirmasi Otomatis"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Respon WA</span>
                </a>

                {/* 2. Jump to Order in Admin */}
                <button
                  type="button"
                  onClick={() => {
                    onViewOrder(order);
                    onDismiss(toast.id);
                  }}
                  className="col-span-1 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold py-2 px-2.5 rounded-xl shadow flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                  title="Buka dan Tangani Pesanan di Daftar Pesanan"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Buka Detail</span>
                </button>

                {/* 3. Open Digital Invoice */}
                <button
                  type="button"
                  onClick={() => {
                    onOpenInvoice(order);
                    onDismiss(toast.id);
                  }}
                  className="col-span-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                  title="Buka Nota Digital Resmi untuk Cetak / PDF"
                >
                  <FileText className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Cetak Nota</span>
                </button>
              </div>
            </div>

            {/* Countdown Progress Bar (Pauses on Hover) */}
            <div className="w-full bg-zinc-800 h-1.5 relative overflow-hidden">
              <div
                className={`h-full transition-all ease-linear ${
                  toast.isPaused ? 'bg-amber-400' : 'bg-orange-500'
                }`}
                style={{ width: `${toast.progress}%` }}
              />
            </div>
            {toast.isPaused && (
              <div className="bg-zinc-900 text-amber-300 text-[10px] text-center py-0.5 font-medium border-t border-zinc-800">
                Waktu ditunda sementara (kursor diarahkan ke notifikasi)
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
