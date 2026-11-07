import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Tag, 
  Flame, 
  Truck, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Clock, 
  ArrowRight, 
  Layers, 
  Percent,
  CheckCircle2,
  Gift
} from 'lucide-react';
import { generateWhatsAppDirectUrl } from '../utils/orderCalculator';

export interface PromoOffer {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  highlightDiscount: string;
  targetProductId: string;
  targetProductName: string;
  suggestedRit: number;
  promoCode: string;
  description: string;
  expiryDateText: string;
  savingsEstimate: string;
}

export const PROMO_OFFERS: PromoOffer[] = [
  {
    id: 'promo-pasir-volume',
    badge: 'PROMO MUSIM COR',
    badgeColor: 'bg-orange-600 text-white border-orange-500',
    title: 'Diskon Volume Pasir Cor Nabire',
    subtitle: 'Paket Proyek Struktur Beton & Gedung Bertingkat',
    highlightDiscount: 'Potongan Rp 50.000 / Rit',
    targetProductId: 'prod_pasir_01',
    targetProductName: 'Pasir Bangunan & Pengecoran',
    suggestedRit: 5,
    promoCode: 'COR-NABIRE5',
    description: 'Pemesanan minimal 5 Rit Pasir Cor Wangar Makmur mendapatkan potongan harga langsung per rit dan prioritas antrian muat dump truck pagi.',
    expiryDateText: 'Berlaku s/d 30 Nov 2026',
    savingsEstimate: 'Hemat Rp 250.000 - Rp 500.000',
  },
  {
    id: 'promo-sirtu-ongkir',
    badge: 'SUBSIDI ARMADA',
    badgeColor: 'bg-emerald-600 text-white border-emerald-500',
    title: 'Subsidi Ongkir Pengerasan Sirtu Jalan',
    subtitle: 'Solusi Pemadatan Akses Jalan & Kavling Perumahan',
    highlightDiscount: 'Gratis Subsidi Ongkir 100%',
    targetProductId: 'prod_sirtu_03',
    targetProductName: 'Sirtu (Pasir Batu Pengerasan)',
    suggestedRit: 10,
    promoCode: 'SIRTU-WANGAR10',
    description: 'Pemesanan minimal 10 Rit Sirtu untuk proyek jalan desa atau perkebunan gratis biaya antar dump truck khusus wilayah Nabire Barat & Wangar Makmur.',
    expiryDateText: 'Promo Kuota 500 Rit Pertama',
    savingsEstimate: 'Bebas Ongkir Pengantaran Ritase',
  },
  {
    id: 'promo-paket-fondasi',
    badge: 'PAKET KOMBO FONDASI',
    badgeColor: 'bg-amber-500 text-zinc-950 font-black border-amber-400',
    title: 'Paket Kombo Batu Fondasi Kali & Andesit',
    subtitle: 'Konstruksi Tahan Gempa & Talud Penahan Tebing',
    highlightDiscount: 'Cashback Spesial Rp 75.000 / Rit',
    targetProductId: 'prod_batu_02',
    targetProductName: 'Batu Belah & Batu Pecah Fondasi',
    suggestedRit: 4,
    promoCode: 'FONDASI-KMD4',
    description: 'Dapatkan potongan langsung untuk setiap rit batu andesit/kali keras saat dipesan bersama pasir cor untuk pembangunan tapak dan sloof.',
    expiryDateText: 'Penawaran Spesial Musim Proyek',
    savingsEstimate: 'Kualitas Batu Keras Alami Wangar',
  },
  {
    id: 'promo-timbunan-lahan',
    badge: 'REKLAMASI LAHAN',
    badgeColor: 'bg-blue-600 text-white border-blue-500',
    title: 'Tarif Spesial Timbunan Padas Massal',
    subtitle: 'Pemerataan Tanah Rawa & Tapak Gudang Logistik',
    highlightDiscount: 'Mulai Rp 600.000 / Rit',
    targetProductId: 'prod_tanah_04',
    targetProductName: 'Tanah Timbunan & Pemerataan Lahan',
    suggestedRit: 10,
    promoCode: 'TIMBUNAN-PADAS',
    description: 'Kontrak pemerataan tanah timbunan padas volume $\\ge 10$ rit dengan harga hemat khusus kontraktor pengurugan di seluruh penjuru Nabire.',
    expiryDateText: 'Khusus Kontrak Periode Ini',
    savingsEstimate: 'Kesiapan Excavator & Dump Truck',
  },
];

interface PromoBannerProps {
  onClaimPromo: (productId: string, rit: number, promoCode: string) => void;
  adminWhatsApp: string;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  onClaimPromo,
  adminWhatsApp,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const activeOffer = PROMO_OFFERS[currentIdx];

  // Auto-cycle through offers every 6.5s if not hovered/paused
  useEffect(() => {
    if (!isAutoPlay || isDismissed) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % PROMO_OFFERS.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isAutoPlay, isDismissed]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAutoPlay(false);
    setCurrentIdx((prev) => (prev - 1 + PROMO_OFFERS.length) % PROMO_OFFERS.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAutoPlay(false);
    setCurrentIdx((prev) => (prev + 1) % PROMO_OFFERS.length);
  };

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleWhatsAppConsult = (offer: PromoOffer, e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Halo CV KAMINDIPMAN, saya tertarik dengan "${offer.title}" (${offer.promoCode}). Mohon informasi pemesanan material ${offer.targetProductName} untuk lokasi proyek kami di Nabire.`;
    const url = generateWhatsAppDirectUrl(adminWhatsApp, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // If user closed banner, provide an unobtrusive banner revival trigger
  if (isDismissed) {
    return (
      <div className="bg-zinc-900 border-b border-orange-500/30 text-zinc-300 py-1.5 px-4 text-xs select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="font-semibold text-zinc-300 truncate">
              🔥 Penawaran Musim Proyek Aktif: <strong className="text-orange-400 font-bold">{activeOffer.title}</strong> ({activeOffer.highlightDiscount})
            </span>
          </div>
          <button
            onClick={() => setIsDismissed(false)}
            className="shrink-0 text-orange-400 hover:text-orange-300 font-bold underline text-[11px] cursor-pointer"
          >
            Tampilkan Banner Promo
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside
      aria-label="Penawaran dan Promo Spesial Material CV KAMINDIPMAN"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
      className="relative z-30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white border-b-2 border-orange-600 shadow-lg overflow-hidden transition-all duration-300"
    >
      {/* Decorative Subtle Construction Accent Stripes */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px]" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 relative">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Left Block: Offer Details & Badge */}
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
            
            {/* Promotional Icon Box */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0 mt-0.5 sm:mt-0 shadow-inner">
              <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              
              {/* Badge + Expiry row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-black uppercase tracking-wider border shadow-sm ${activeOffer.badgeColor}`}>
                  {activeOffer.badge}
                </span>

                <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 font-medium">
                  <Clock className="w-3 h-3 text-orange-400" />
                  <span>{activeOffer.expiryDateText}</span>
                </span>

                <span className="hidden md:inline-block text-zinc-600">•</span>
                
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>{activeOffer.savingsEstimate}</span>
                </span>
              </div>

              {/* Title and Highlight */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
                <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight truncate">
                  {activeOffer.title}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-orange-600/30 border border-orange-500/40 text-orange-300 font-black text-xs self-start sm:self-auto shrink-0 font-mono">
                  {activeOffer.highlightDiscount}
                </span>
              </div>

              {/* Description & Target Material */}
              <p className="text-xs text-zinc-400 line-clamp-1 sm:line-clamp-none max-w-2xl leading-relaxed">
                {activeOffer.description}
              </p>
            </div>

          </div>

          {/* Right Block: Action Buttons & Promo Code */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 shrink-0 pt-2 lg:pt-0 border-t border-zinc-800/80 lg:border-t-0 justify-between sm:justify-end">
            
            {/* Promo Code Copy Pill */}
            <div className="flex items-center bg-zinc-900 border border-zinc-700 hover:border-zinc-500 rounded-lg p-1 px-2.5 gap-2 transition-colors">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold leading-none">
                  Kode Promo
                </span>
                <span className="text-xs font-mono font-bold text-orange-400">
                  {activeOffer.promoCode}
                </span>
              </div>
              <button
                onClick={(e) => handleCopyCode(activeOffer.promoCode, e)}
                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Salin Kode Promo"
                aria-label={`Salin kode promo ${activeOffer.promoCode}`}
              >
                {copiedCode === activeOffer.promoCode ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Claim Promo CTA Button */}
            <button
              onClick={() => onClaimPromo(activeOffer.targetProductId, activeOffer.suggestedRit, activeOffer.promoCode)}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg shadow-md hover:shadow-orange-600/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Klaim Promo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* WA Help Button */}
            <button
              onClick={(e) => handleWhatsAppConsult(activeOffer, e)}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-2 text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              title="Konsultasi Promo via WhatsApp"
            >
              <span>Tanya WA</span>
            </button>

            {/* Carousel Navigation Arrows */}
            <div className="flex items-center gap-1 pl-1">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Penawaran sebelumnya"
                title="Promo sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Penawaran selanjutnya"
                title="Promo selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Close / Dismiss Banner Button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors cursor-pointer"
              aria-label="Tutup banner penawaran promo"
              title="Tutup banner promo"
            >
              <X className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Carousel Indicators Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5 pt-1.5 border-t border-zinc-900">
          {PROMO_OFFERS.map((offer, idx) => (
            <button
              key={offer.id}
              onClick={() => {
                setIsAutoPlay(false);
                setCurrentIdx(idx);
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentIdx === idx
                  ? 'w-6 bg-orange-500'
                  : 'w-2 bg-zinc-700 hover:bg-zinc-600'
              }`}
              aria-label={`Pilih penawaran ${idx + 1}: ${offer.title}`}
            />
          ))}
        </div>

      </div>
    </aside>
  );
};
