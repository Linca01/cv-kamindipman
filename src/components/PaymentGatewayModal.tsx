import React from 'react';
import { X, CheckCircle, Copy, Clock, QrCode, Shield, RefreshCw } from 'lucide-react';
import { Order } from '../types';
import { formatRupiah } from '../utils/orderCalculator';
import { storageService } from '../services/storageService';

interface PaymentGatewayModalProps {
  order: Order | null;
  onClose: () => void;
  onPaymentSuccess: (updatedOrder: Order) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  order,
  onClose,
  onPaymentSuccess,
}) => {
  const [selectedChannel, setSelectedChannel] = React.useState<'qris' | 'va_mandiri' | 'va_bca' | 'va_bri'>('qris');
  const [copied, setCopied] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(15 * 60); // 15 minutes timer

  React.useEffect(() => {
    if (!order) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [order]);

  if (!order) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTimer = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Generate deterministic VA number based on order code
  const vaNumbers = {
    va_bca: `70012${order.orderCode.replace(/\D/g, '').padEnd(10, '8')}`,
    va_mandiri: `88910${order.orderCode.replace(/\D/g, '').padEnd(10, '3')}`,
    va_bri: `12800${order.orderCode.replace(/\D/g, '').padEnd(10, '5')}`,
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Update database status
      storageService.updatePaymentStatus(order.id, 'paid', {
        gateway: 'midtrans',
        channel: selectedChannel,
        transactionId: `MID-TRX-${Date.now()}`,
      });

      const updated = storageService.getOrderByCode(order.orderCode);
      setIsProcessing(false);
      if (updated) {
        onPaymentSuccess(updated);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-zinc-950 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-orange-600 flex items-center justify-center font-bold text-sm">
              PG
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                Midtrans / Xendit Payment Gateway
              </h3>
              <p className="text-[11px] text-zinc-400">
                Sistem Pembayaran Resmi CV KAMINDIPMAN
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-md"
            aria-label="Tutup pembayaran"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary Bar */}
        <div className="bg-zinc-100 px-6 py-3 border-b border-zinc-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-zinc-500">Kode Pesanan:</span>{' '}
            <span className="font-mono font-bold text-zinc-900">{order.orderCode}</span>
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-orange-600">
            <Clock className="w-3.5 h-3.5" />
            <span>Sisa Waktu: {formattedTimer}</span>
          </div>
        </div>

        {/* Amount to pay */}
        <div className="px-6 py-4 bg-orange-50/50 border-b border-orange-100 text-center">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Total yang Harus Dibayar:
          </span>
          <div className="text-2xl sm:text-3xl font-black text-orange-600 font-mono tracking-tight mt-0.5">
            {formatRupiah(order.totalAmount)}
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Pemesan: {order.customerName} ({order.customerPhone})
          </p>
        </div>

        {/* Payment Channels Tabs */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-2">
              Pilih Metode Pembayaran Online:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedChannel('qris')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                  selectedChannel === 'qris'
                    ? 'border-orange-600 bg-orange-600 text-white'
                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>QRIS (Semua Bank & E-Wallet)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedChannel('va_mandiri')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-colors ${
                  selectedChannel === 'va_mandiri'
                    ? 'border-orange-600 bg-orange-600 text-white'
                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                Virtual Account Mandiri
              </button>

              <button
                type="button"
                onClick={() => setSelectedChannel('va_bca')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-colors ${
                  selectedChannel === 'va_bca'
                    ? 'border-orange-600 bg-orange-600 text-white'
                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                Virtual Account BCA
              </button>

              <button
                type="button"
                onClick={() => setSelectedChannel('va_bri')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-colors ${
                  selectedChannel === 'va_bri'
                    ? 'border-orange-600 bg-orange-600 text-white'
                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                Virtual Account BRI
              </button>
            </div>
          </div>

          {/* QRIS Display View */}
          {selectedChannel === 'qris' && (
            <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 text-center space-y-3">
              <div className="inline-block p-3 bg-white rounded-lg border border-zinc-300 shadow-inner">
                {/* Simulated high contrast QR Code display */}
                <div className="w-44 h-44 bg-zinc-900 mx-auto flex items-center justify-center p-2 rounded">
                  <div className="w-full h-full bg-white p-2 rounded flex flex-col justify-between items-center">
                    <div className="w-full flex justify-between">
                      <div className="w-8 h-8 bg-zinc-900 border-2 border-white rounded-sm" />
                      <div className="w-8 h-8 bg-zinc-900 border-2 border-white rounded-sm" />
                    </div>
                    <div className="text-center font-bold text-[10px] text-zinc-900 leading-tight">
                      <div className="font-extrabold text-xs">QRIS CV KAMINDIPMAN</div>
                      <div>NABIRE PAPUA TENGAH</div>
                      <div className="text-[8px] text-zinc-500 font-mono mt-1">NMID: ID102938472910</div>
                    </div>
                    <div className="w-full flex justify-between">
                      <div className="w-8 h-8 bg-zinc-900 border-2 border-white rounded-sm" />
                      <div className="w-6 h-6 bg-zinc-700 rounded-sm" />
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Pindai QR code ini menggunakan aplikasi BCA Mobile, Livin Mandiri, BRImo, BNI Mobile, GoPay, OVO, Dana, atau ShopeePay.
              </p>
            </div>
          )}

          {/* Virtual Account Display View */}
          {selectedChannel !== 'qris' && (
            <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 space-y-3">
              <div className="text-xs font-semibold text-zinc-500">
                Nomor Virtual Account ({selectedChannel.replace('va_', '').toUpperCase()}):
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-zinc-300 font-mono text-base font-bold text-zinc-900">
                <span>{vaNumbers[selectedChannel]}</span>
                <button
                  onClick={() => handleCopy(vaNumbers[selectedChannel])}
                  className="px-2.5 py-1 text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded flex items-center gap-1 font-sans"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <div className="text-xs text-zinc-500 space-y-1">
                <p>1. Masuk ke Mobile Banking / ATM pilihan Anda.</p>
                <p>2. Pilih menu Transfer Virtual Account.</p>
                <p>3. Masukkan nomor VA di atas, total tagihan akan otomatis muncul.</p>
              </div>
            </div>
          )}

          {/* Simulation & Real-time Webhook Button */}
          <div className="pt-2 border-t border-zinc-200 space-y-2">
            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menghubungkan ke Gateway...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Simulasikan Pembayaran Berhasil (Tes Midtrans/Xendit)</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
              <Shield className="w-3.5 h-3.5 text-zinc-400" />
              <span>Dienkripsi SSL 256-bit aman & otomatis memperbarui status transaksi</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
