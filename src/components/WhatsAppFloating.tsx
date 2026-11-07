import React from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { CompanySettings } from '../types';
import { generateWhatsAppDirectUrl } from '../utils/orderCalculator';

interface WhatsAppFloatingProps {
  settings: CompanySettings;
}

export const WhatsAppFloating: React.FC<WhatsAppFloatingProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [quickName, setQuickName] = React.useState('');
  const [quickMaterial, setQuickMaterial] = React.useState('Pasir Bangunan & Cor');
  const [quickRit, setQuickRit] = React.useState('3');
  const [quickLocation, setQuickLocation] = React.useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = [
      'Halo CV KAMINDIPMAN, saya ingin memesan material.',
      '',
      `Nama: ${quickName || 'Pelanggan'}`,
      `Jenis Material: ${quickMaterial}`,
      `Jumlah Rit: ${quickRit} rit`,
      `Lokasi Pengiriman: ${quickLocation || 'Nabire'}`,
      '',
      'Mohon informasi harga dan konfirmasi ketersediaan.',
    ].join('\n');

    const url = generateWhatsAppDirectUrl(settings.adminWhatsApp, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleDirectClick = () => {
    const defaultMsg = 'Halo CV KAMINDIPMAN, saya ingin menanyakan ketersediaan material pasir, batu, sirtu, dan tanah timbunan di Nabire.';
    const url = generateWhatsAppDirectUrl(settings.adminWhatsApp, defaultMsg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end print:hidden">
      {/* Quick Consultation Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-emerald-600 px-4 py-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm">
                WA
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Chat Admin CV KAMINDIPMAN</h4>
                <p className="text-[11px] text-emerald-100">Siap melayani kebutuhan material Anda</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-emerald-200 p-1"
              aria-label="Tutup popup WhatsApp"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSend} className="p-4 space-y-3 bg-zinc-50 text-xs">
            <div>
              <label className="block text-zinc-700 font-semibold mb-1">Nama Anda:</label>
              <input
                type="text"
                placeholder="Contoh: Bpk. Markus"
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded text-zinc-900 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Jenis Material:</label>
                <select
                  value={quickMaterial}
                  onChange={(e) => setQuickMaterial(e.target.value)}
                  className="w-full px-2 py-1.5 border border-zinc-300 rounded text-zinc-900 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Pasir Bangunan & Cor">Pasir Bangunan</option>
                  <option value="Batu Belah & Pecah">Batu Fondasi</option>
                  <option value="Sirtu (Pasir Batu)">Sirtu Jalan</option>
                  <option value="Tanah Timbunan">Tanah Timbunan</option>
                </select>
              </div>
              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Jumlah Rit:</label>
                <input
                  type="number"
                  min="1"
                  value={quickRit}
                  onChange={(e) => setQuickRit(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-zinc-300 rounded text-zinc-900 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-700 font-semibold mb-1">Lokasi Pengiriman di Nabire:</label>
              <input
                type="text"
                placeholder="Contoh: Kalibobo / Nabire Barat"
                value={quickLocation}
                onChange={(e) => setQuickLocation(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-zinc-300 rounded text-zinc-900 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Kirim Pesan WhatsApp
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Floating Button */}
      <div className="flex items-center gap-2">
        {!isOpen && (
          <div className="hidden sm:block bg-zinc-900 text-white px-3 py-1.5 rounded-lg shadow-lg border border-zinc-700 text-xs font-semibold animate-pulse">
            Tanya Harga via WhatsApp
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          aria-label="Buka Chat WhatsApp CV KAMINDIPMAN"
        >
          {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
        </button>
      </div>
    </div>
  );
};
