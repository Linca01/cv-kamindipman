import React from 'react';
import { Truck, MapPin, Calculator, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react';
import { HERO_IMAGE } from '../data/initialData';
import { CompanySettings, Product } from '../types';
import { formatRupiah, generateWhatsAppDirectUrl } from '../utils/orderCalculator';

interface HomeHeroProps {
  onGoToOrder: (productId?: string) => void;
  onGoToProducts: () => void;
  settings: CompanySettings;
  products: Product[];
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onGoToOrder,
  onGoToProducts,
  settings,
  products,
}) => {
  const [selectedProduct, setSelectedProduct] = React.useState(products[0]?.id || '');
  const [ritCount, setRitCount] = React.useState(3);

  const activeProd = products.find((p) => p.id === selectedProduct) || products[0];
  const quickSubtotal = activeProd ? activeProd.pricePerRit * ritCount : 0;

  const handleWhatsAppInquiry = () => {
    const msg = `Halo CV KAMINDIPMAN, saya tertarik menanyakan harga dan ketersediaan ${activeProd?.name || 'material'} sebanyak ${ritCount} rit di Nabire.`;
    const url = generateWhatsAppDirectUrl(settings.adminWhatsApp, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative bg-zinc-950 text-white overflow-hidden">
      {/* Background with Darkened Image Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Quarry Tambang Material CV KAMINDIPMAN di Wangar Makmur Nabire Barat"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-16 lg:pb-28">
        
        {/* Top Badges / Trust Markers */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6 text-xs text-zinc-300 font-medium">
          <div className="flex items-center gap-1.5 bg-orange-600/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-md">
            <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span>Quarry: Kampung Wangar Makmur, Nabire Barat</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-zinc-400">
            <span>·</span>
            <span>Papua Tengah</span>
            <span>·</span>
            <span>Armada Dump Truck Siap Antar</span>
          </div>
        </div>

        {/* 2-Column Split Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headline & Story */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Supplier Material Bangunan Terpercaya <span className="text-orange-500">Nabire</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">
              <strong className="text-white font-semibold">CV KAMINDIPMAN</strong> menyediakan suplai{' '}
              <span className="text-orange-400 font-medium">Pasir Sungai Bersih</span>,{' '}
              <span className="text-orange-400 font-medium">Batu Fondasi Keras</span>,{' '}
              <span className="text-orange-400 font-medium">Sirtu Pengerasan Jalan</span>, dan{' '}
              <span className="text-orange-400 font-medium">Tanah Timbunan Padas</span> langsung dari sumber tambang galian di Kampung Wangar Makmur, Nabire Barat.
            </p>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap gap-3 sm:gap-4 items-center">
              <button
                onClick={() => onGoToOrder(activeProd?.id)}
                className="px-6 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg shadow-lg hover:shadow-orange-600/30 transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <span>Pesan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onGoToProducts}
                className="px-6 py-3.5 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold rounded-lg transition-colors text-sm sm:text-base cursor-pointer"
              >
                Lihat Semua Produk
              </button>

              <button
                onClick={handleWhatsAppInquiry}
                className="px-4 py-3.5 bg-emerald-700/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-600/40 font-semibold rounded-lg transition-colors flex items-center gap-2 text-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">WhatsApp Admin</span>
              </button>
            </div>

            {/* Trust Cards Row */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-zinc-800 text-left">
              <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <div className="text-orange-500 font-bold text-xs uppercase tracking-wider mb-1">Rit Penuh Terjamin</div>
                <div className="text-sm font-semibold text-white">Dump Truck ±4-5 m³</div>
                <div className="text-xs text-zinc-400">Muatan munjung & padat</div>
              </div>

              <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <div className="text-orange-500 font-bold text-xs uppercase tracking-wider mb-1">Metode Bayar Fleksibel</div>
                <div className="text-sm font-semibold text-white">Online, COD, atau WA</div>
                <div className="text-xs text-zinc-400">Bayar saat tiba di lokasi</div>
              </div>

              <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 col-span-2 sm:col-span-1">
                <div className="text-orange-500 font-bold text-xs uppercase tracking-wider mb-1">Jangkauan Luas</div>
                <div className="text-sm font-semibold text-white">Seluruh Nabire & Sekitar</div>
                <div className="text-xs text-zinc-400">Pengiriman cepat terkoordinasi</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quick Calculator Card */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-900/90 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-zinc-800 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2 text-orange-500">
                  <Calculator className="w-5 h-5" />
                  <span className="font-bold text-sm text-white uppercase tracking-wider">Kalkulator Cepat Material</span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  Harga Resmi CV KAMINDIPMAN
                </span>
              </div>

              {/* Material Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  1. Pilih Jenis Material Bangunan:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {products.map((prod) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => setSelectedProduct(prod.id)}
                      className={`text-left p-2.5 rounded-lg border text-xs font-medium transition-all ${
                        selectedProduct === prod.id
                          ? 'border-orange-500 bg-orange-600/15 text-white shadow-sm ring-1 ring-orange-500/50'
                          : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      <div className="font-bold truncate">{prod.name.split('&')[0]}</div>
                      <div className="text-[11px] text-orange-400 font-mono mt-0.5">
                        {formatRupiah(prod.pricePerRit)} / rit
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rit Quantity Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  2. Pilih Jumlah Kebutuhan (Rit):
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[1, 2, 3, 5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRitCount(num)}
                      className={`flex-1 min-w-[50px] py-2 rounded-lg text-xs font-bold transition-colors ${
                        ritCount === num
                          ? 'bg-orange-600 text-white shadow-sm'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {num} Rit
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-zinc-400">Atau jumlah rit kustom:</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={ritCount}
                    onChange={(e) => setRitCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-2.5 py-1 text-center bg-zinc-950 border border-zinc-700 rounded text-sm font-bold text-white focus:outline-none focus:border-orange-500"
                  />
                  <span className="text-xs text-zinc-400">rit dump truck</span>
                </div>
              </div>

              {/* Calculation Result Box */}
              <div className="p-4 bg-zinc-950/90 rounded-xl border border-zinc-800 space-y-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Rumus Perhitungan:</span>
                  <span className="font-mono text-zinc-300">Harga Per Rit × Jumlah Rit</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-300">
                  <span>Harga Satuan:</span>
                  <span className="font-mono">{formatRupiah(activeProd?.pricePerRit || 0)} / rit</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-300">
                  <span>Jumlah Pesanan:</span>
                  <span className="font-bold">{ritCount} rit</span>
                </div>
                <div className="pt-2 border-t border-zinc-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Perkiraan Total Material:</span>
                  <span className="text-xl font-extrabold text-orange-400 font-mono">
                    {formatRupiah(quickSubtotal)}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 italic">
                  *Belum termasuk ongkos kirim sesuai distrik pengiriman di Nabire.
                </p>
              </div>

              {/* Direct Next Button */}
              <button
                type="button"
                onClick={() => onGoToOrder(activeProd?.id)}
                className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
              >
                <span>Lanjutkan Pemesanan Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
