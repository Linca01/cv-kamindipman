import React from 'react';
import { ShieldCheck, Truck, MapPin, Award, CheckCircle, Users } from 'lucide-react';
import { CompanySettings } from '../types';

interface AboutSectionProps {
  settings: CompanySettings;
  onGoToOrder: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings, onGoToOrder }) => {
  return (
    <section className="py-16 bg-white text-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Profil Perusahaan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
            Tentang CV KAMINDIPMAN
          </h2>
          <p className="text-base text-zinc-600 mt-2 leading-relaxed">
            Mitra andal pengadaan material galian konstruksi terpercaya di Kabupaten Nabire, Papua Tengah.
          </p>
        </div>

        {/* 2-Column Split: Company Story & Key Strengths */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-zinc-700 text-sm leading-relaxed">
            <p className="text-base font-semibold text-zinc-900">
              {settings.description}
            </p>
            <p>
              Berawal dari kebutuhan percepatan infrastruktur dan perumahan di Kabupaten Nabire pasca penetapan sebagai Ibukota Provinsi Papua Tengah, <strong>CV KAMINDIPMAN</strong> hadir menyediakan akses langsung bagi kontraktor, badan usaha, dan masyarakat umum untuk mendapatkan material tambang berkualitas tinggi langsung dari sumber deposit alam kami di <strong>Kampung Wangar Makmur, Distrik Nabire Barat</strong>.
            </p>
            <p>
              Kami mengutamakan kejujuran takaran rit dump truck (muatan penuh standar ±4-5 m³), kebersihan pasir dari endapan lumpur, kekerasan batu kali untuk pondasi gempa, gradasi sirtu yang padat untuk perkerasan jalan, serta daya dukung tanah timbunan padas terbaik.
            </p>

            {/* Core Values / Commitments */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="flex items-center gap-2 font-bold text-zinc-900 mb-1">
                  <Truck className="w-4 h-4 text-orange-600" />
                  <span>Armada Dump Truck Mandiri</span>
                </div>
                <p className="text-xs text-zinc-600">
                  Didukung armada dump truck siap jalan untuk memastikan pengiriman material tidak tertunda ke lokasi proyek Anda.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="flex items-center gap-2 font-bold text-zinc-900 mb-1">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span>Transparansi Harga & Volume</span>
                </div>
                <p className="text-xs text-zinc-600">
                  Perhitungan harga otomatis per rit secara terbuka tanpa biaya tersembunyi. Nota resmi disertakan di setiap pengiriman.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="flex items-center gap-2 font-bold text-zinc-900 mb-1">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>Lokasi Tambang Strategis</span>
                </div>
                <p className="text-xs text-zinc-600">
                  Kampung Wangar Makmur, Nabire Barat dengan akses jalan yang mudah dijangkau armada pengangkut dari semua distrik.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="flex items-center gap-2 font-bold text-zinc-900 mb-1">
                  <Users className="w-4 h-4 text-orange-600" />
                  <span>Pelayanan Berorientasi Pelanggan</span>
                </div>
                <p className="text-xs text-zinc-600">
                  Dapat memesan secara online, bayar COD saat tiba di proyek, maupun konsultasi langsung via WhatsApp dengan admin.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onGoToOrder}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
              >
                Pesan Material Sekarang
              </button>
            </div>
          </div>

          {/* Right Column: Key Details & Certifications Card */}
          <div className="lg:col-span-5 bg-zinc-900 text-white rounded-2xl p-7 border border-zinc-800 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-orange-500 border-b border-zinc-800 pb-3">
              Informasi Resmi Perusahaan
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-zinc-400 block mb-0.5">Nama Usaha:</span>
                <strong className="text-base text-white font-black">{settings.companyName}</strong>
              </div>

              <div>
                <span className="text-zinc-400 block mb-0.5">Bidang Usaha:</span>
                <span className="text-zinc-200 font-semibold">
                  Penjualan & Suplai Material Bangunan (Pasir, Batu, Sirtu, Tanah Timbunan)
                </span>
              </div>

              <div>
                <span className="text-zinc-400 block mb-0.5">Wilayah Pengambilan Material:</span>
                <span className="text-zinc-200 font-medium">
                  {settings.quarryLocation}
                </span>
              </div>

              <div>
                <span className="text-zinc-400 block mb-0.5">Target Layanan Pelanggan:</span>
                <span className="text-zinc-300">
                  Masyarakat umum, kontraktor pembangunan, perusahaan konstruksi BUMN/Swasta, toko bangunan, dan proyek perumahan di Nabire.
                </span>
              </div>

              <div>
                <span className="text-zinc-400 block mb-0.5">Jam Operasional Pelayanan:</span>
                <span className="text-zinc-200 font-medium">
                  {settings.operationalHours}
                </span>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <span className="text-zinc-400 block mb-2">Rekening Resmi Pembayaran Transfer:</span>
                <div className="space-y-2">
                  {settings.bankAccounts.map((acc, idx) => (
                    <div key={idx} className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 font-mono flex justify-between items-center">
                      <div>
                        <div className="font-bold text-orange-400">{acc.bank}</div>
                        <div className="text-white text-xs">{acc.accountNumber}</div>
                      </div>
                      <div className="text-[10px] text-zinc-400 text-right">a.n {acc.accountHolder}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
