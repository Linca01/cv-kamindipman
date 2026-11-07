import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import { CompanySettings } from '../types';
import { NewsletterSubscribe } from './NewsletterSubscribe';

interface FooterProps {
  settings: CompanySettings;
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, setActiveTab }) => {
  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        
        {/* Newsletter Subscription Card */}
        <NewsletterSubscribe />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-orange-600 flex items-center justify-center font-black text-xl text-white">
                K
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-tight text-white leading-none">
                  CV KAMINDIPMAN
                </h3>
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                  Material Bangunan Nabire
                </span>
              </div>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed">
              Perusahaan supplier material tambang galian C dan bahan konstruksi terpercaya di Nabire, Papua Tengah. Melayani pengadaan pasir cor, batu fondasi, sirtu jalan, dan tanah timbunan proyek.
            </p>

            <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>Legalitas Resmi Usaha Konstruksi Nabire</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <button
                  onClick={() => { setActiveTab('beranda'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Beranda Utama
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('produk'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Katalog Produk Material
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('pemesanan'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Kalkulator & Formulir Pemesanan
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('cek-pesanan'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Cek Status Pesanan (Tracking)
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('riwayat-pesanan'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Riwayat & Arsip Pesanan
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('tentang-kami'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Tentang CV KAMINDIPMAN
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('beranda');
                    setTimeout(() => {
                      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Tanya Jawab (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Portal Admin
                </button>
              </li>
            </ul>
          </div>

          {/* Produk Material */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              Produk Material
            </h4>
            <ul className="space-y-2 text-zinc-400 text-xs">
              <li>
                <strong className="text-zinc-300">1. Pasir:</strong> Bangunan, pengecoran, konstruksi.
              </li>
              <li>
                <strong className="text-zinc-300">2. Batu:</strong> Batu belah pecah, fondasi bangunan.
              </li>
              <li>
                <strong className="text-zinc-300">3. Sirtu:</strong> Pasir batu, perkerasan jalan, urugan.
              </li>
              <li>
                <strong className="text-zinc-300">4. Tanah Timbunan:</strong> Reklamasi lahan & pemerataan.
              </li>
            </ul>
          </div>

          {/* Quarry & Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              Lokasi & Kontak
            </h4>
            <div className="space-y-2 text-zinc-400 text-xs leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>{settings.quarryLocation}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>+{settings.adminWhatsApp}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                <span>{settings.operationalHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-zinc-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} <strong>CV KAMINDIPMAN</strong>. Seluruh hak cipta dilindungi. Nabire, Papua Tengah.
          </div>
          <div className="flex items-center gap-4">
            <span>Sistem Pemesanan Online & WhatsApp</span>
            <span>·</span>
            <button
              onClick={() => setActiveTab('admin')}
              className="text-zinc-400 hover:text-white"
            >
              Login Petugas
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
