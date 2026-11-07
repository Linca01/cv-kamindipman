import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { Order, CompanySettings } from '../types';
import { formatRupiah } from '../utils/orderCalculator';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
  settings: CompanySettings;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  onClose,
  settings,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-zinc-200 my-4 print:my-0 print:border-none print:shadow-none">
        
        {/* Modal Top Actions (Hidden on Print) */}
        <div className="bg-zinc-950 px-6 py-4 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm sm:text-base">
              Bukti Pemesanan Resmi & Invoice Digital
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Nota / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1 rounded-md"
              aria-label="Tutup nota"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-8 sm:p-10 text-zinc-900 bg-white space-y-6">
          
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b-2 border-zinc-900 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-orange-600 text-white flex items-center justify-center font-black text-xl">
                  K
                </div>
                <div>
                  <h1 className="text-2xl font-black text-zinc-900 tracking-tight leading-none">
                    {settings.companyName}
                  </h1>
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mt-1">
                    SUPPLIER MATERIAL BANGUNAN & GALIAN C
                  </p>
                </div>
              </div>

              <div className="text-xs text-zinc-600 mt-3 space-y-0.5 leading-relaxed">
                <p><strong>Quarry / Titik Ambil:</strong> {settings.quarryLocation}</p>
                <p><strong>Wilayah:</strong> {settings.district}, {settings.city}, {settings.province}</p>
                <p><strong>WhatsApp / Telp:</strong> {settings.adminWhatsApp} / {settings.alternatePhone}</p>
                <p><strong>Email:</strong> {settings.email}</p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 bg-zinc-900 text-white text-xs font-black uppercase tracking-wider rounded">
                NOTA PESANAN MATERIAL
              </span>
              <div className="text-xs text-zinc-500 mt-2">Nomor Transaksi:</div>
              <div className="text-xl font-black font-mono text-zinc-900">
                {order.orderCode}
              </div>
              <div className="text-xs text-zinc-600">
                Tanggal: {new Date(order.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-xs">
            <div>
              <div className="font-bold text-zinc-500 uppercase tracking-wider mb-1.5 text-[10px]">
                DATA PEMESAN:
              </div>
              <div className="font-bold text-base text-zinc-900">{order.customerName}</div>
              <div className="text-zinc-600 font-mono mt-0.5">WhatsApp: {order.customerPhone}</div>
              {order.customerEmail && <div className="text-zinc-500">Email: {order.customerEmail}</div>}
            </div>

            <div>
              <div className="font-bold text-zinc-500 uppercase tracking-wider mb-1.5 text-[10px]">
                METODE & LOKASI PENGIRIMAN:
              </div>
              <div className="font-bold text-zinc-900">
                {order.deliveryMethod === 'delivery' ? 'Pengiriman Dump Truck CV KAMINDIPMAN' : 'Ambil Sendiri di Quarry'}
              </div>
              <div className="text-zinc-700 mt-0.5">{order.deliveryAddress}</div>
              <div className="text-zinc-500">Wilayah: {order.deliveryDistrict}</div>
              {order.deliveryNotes && (
                <div className="text-zinc-500 italic mt-1">Catatan: {order.deliveryNotes}</div>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b-2 border-zinc-300 text-zinc-600 uppercase text-[11px] font-bold">
                  <th className="py-2.5">No.</th>
                  <th className="py-2.5">Uraian Material</th>
                  <th className="py-2.5 text-center">Volume (Rit)</th>
                  <th className="py-2.5 text-right">Harga per Rit</th>
                  <th className="py-2.5 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-mono">{idx + 1}</td>
                    <td className="py-3 font-semibold text-zinc-900">
                      {item.productName}
                      <span className="block text-[10px] text-zinc-500 font-normal">
                        Armada: Dump Truck Standar (± 4-5 m³ per rit)
                      </span>
                    </td>
                    <td className="py-3 text-center font-bold font-mono text-zinc-800">
                      {item.rit} Rit
                    </td>
                    <td className="py-3 text-right font-mono text-zinc-700">
                      {formatRupiah(item.pricePerRit)}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-zinc-900">
                      {formatRupiah(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Breakdown */}
          <div className="pt-4 border-t-2 border-zinc-300 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="text-xs text-zinc-600 max-w-sm space-y-2">
              <div>
                <span className="font-bold text-zinc-800">Metode Pembayaran:</span>{' '}
                <span className="font-semibold uppercase text-orange-700">
                  {order.paymentMethod === 'online' ? 'Pembayaran Online (Gateway)' : order.paymentMethod === 'cod' ? 'COD (Cash on Delivery)' : 'WhatsApp Confirmation'}
                </span>
              </div>
              <div>
                <span className="font-bold text-zinc-800">Status Pembayaran:</span>{' '}
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                  order.paymentStatus === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {order.paymentStatus === 'paid' ? 'LUNAS TERVERIFIKASI' : 'MENUNGGU PEMBAYARAN'}
                </span>
              </div>
              {order.paymentDetails?.transactionId && (
                <div className="text-[11px] text-zinc-500 font-mono">
                  ID Transaksi: {order.paymentDetails.transactionId}
                </div>
              )}
            </div>

            <div className="w-full sm:w-72 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 text-zinc-600">
                <span>Subtotal Material:</span>
                <span className="font-mono font-bold text-zinc-800">{formatRupiah(order.subtotalMaterial)}</span>
              </div>
              <div className="flex justify-between py-1 text-zinc-600">
                <span>Ongkir Dump Truck:</span>
                <span className="font-mono font-bold text-zinc-800">{formatRupiah(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-zinc-900 text-sm font-black text-zinc-900">
                <span>TOTAL AKHIR:</span>
                <span className="font-mono text-base text-orange-600">{formatRupiah(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Legal Stamp & Signatures */}
          <div className="pt-8 border-t border-zinc-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <p className="text-zinc-500 mb-14">Penerima / Pemesan Material,</p>
              <div className="border-b border-zinc-400 w-40 mx-auto" />
              <p className="font-bold text-zinc-900 mt-1">({order.customerName})</p>
            </div>

            <div>
              <p className="text-zinc-500 mb-14">Hormat Kami, CV KAMINDIPMAN</p>
              <div className="border-b border-zinc-400 w-40 mx-auto" />
              <p className="font-bold text-zinc-900 mt-1">(Bagian Logistik & Penjualan)</p>
            </div>
          </div>

          {/* Footer Official Notice */}
          <div className="pt-4 border-t border-zinc-100 text-[10px] text-zinc-400 text-center leading-relaxed">
            Nota pesanan ini merupakan dokumen digital sah dari CV KAMINDIPMAN Nabire, Papua Tengah.
            Material yang telah dibongkar dan diperiksa sesuai pesanan tidak dapat dikembalikan kecuali terjadi cacat spesifikasi.
          </div>

          {/* Bottom Action Buttons (Hidden on Print) */}
          <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3 no-print">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Tutup Nota
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
