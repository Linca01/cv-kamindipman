import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  Layers, 
  FileText, 
  MessageCircle, 
  ArrowRight,
  MapPin,
  Sparkles
} from 'lucide-react';
import { CompanySettings } from '../types';

interface FAQItem {
  id: string;
  category: 'kualitas' | 'pengiriman' | 'pembayaran' | 'proyek';
  categoryLabel: string;
  question: string;
  answer: string;
  keyPoints?: string[];
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq_1',
    category: 'kualitas',
    categoryLabel: 'Mutu & Kapasitas Material',
    question: 'Berapa kapasitas volume material dalam 1 rit dump truck CV KAMINDIPMAN?',
    answer: 'Setiap 1 rit dump truck standar CV KAMINDIPMAN mengangkut muatan munjung dengan volume efektif sekitar 4 hingga 5 meter kubik (± 4-5 m³). Kami menerapkan standar pengisian penuh tanpa dikurangi, sehingga volume material yang tiba di lokasi proyek Anda selalu sesuai dengan takaran riil untuk kebutuhan konstruksi.',
    keyPoints: [
      'Volume efektif ± 4 - 5 m³ per dump truck',
      'Muatan munjung terisi padat dari stockpile Wangar Makmur',
      'Jujur takaran rit dan diperiksa sebelum armada jalan'
    ]
  },
  {
    id: 'faq_2',
    category: 'kualitas',
    categoryLabel: 'Mutu & Kapasitas Material',
    question: 'Bagaimana mutu pasir dan batu dari kuari Kampung Wangar Makmur, Nabire Barat?',
    answer: 'Pasir galian kami berasal dari endapan aluvial sungai alami Wangar Makmur dengan kadar lumpur sangat rendah (< 3%) dan butiran kasar-sedang yang tajam. Sangat memenuhi standar mutu untuk pengecoran beton struktural (K-250 s.d K-350), plesteran halus tanpa retak rambut, dan adukan pasang dinding. Sedangkan batu belah kali kami merupakan batu andesit keras dengan daya tahan tekan tinggi untuk fondasi tahan gempa dan talud.',
    keyPoints: [
      'Kadar lumpur sangat minim (< 3%), adukan semen lebih hemat',
      'Batu kali andesit padat untuk fondasi gedung dan jembatan',
      'Batu split pecah bergradasi seragam untuk agregat beton cor'
    ]
  },
  {
    id: 'faq_3',
    category: 'pengiriman',
    categoryLabel: 'Wilayah & Armada Pengiriman',
    question: 'Wilayah mana saja di Kabupaten Nabire yang dijangkau armada dump truck?',
    answer: 'Kami melayani pengiriman langsung ke seluruh distrik di Kabupaten Nabire dan sekitarnya dari kuari Kampung Wangar Makmur, Distrik Nabire Barat. Wilayah jangkauan kami meliputi: Distrik Nabire Kota (Kalibobo, Oyehe, Karang Mulia, Girimulyo, Siriwini, Morgo), Nabire Barat (Wangar Makmur, Kalisusu, Bumi Mulia), Teluk Kimi (Samabusa & area Pelabuhan Laut), Uwapa (Topo & Jalan Poros Trans Papua), Distrik Wanggar, Makimi (Legari), hingga Yaur.',
    keyPoints: [
      'Menjangkau seluruh distrik dan kelurahan se-Kabupaten Nabire',
      'Ongkos kirim transparan dihitung otomatis sesuai distrik tujuan',
      'Tersedia juga opsi ambil sendiri di kuari Wangar Makmur tanpa ongkos kirim'
    ]
  },
  {
    id: 'faq_4',
    category: 'pengiriman',
    categoryLabel: 'Wilayah & Armada Pengiriman',
    question: 'Berapa lama estimasi waktu pengiriman material setelah pesanan dikonfirmasi?',
    answer: 'Untuk pengiriman ke wilayah Distrik Nabire Barat dan Nabire Kota, armada dump truck biasanya tiba dalam waktu 1 hingga 3 jam setelah pesanan diverifikasi atau disesuaikan dengan jadwal jam pengecoran Anda. Untuk wilayah yang lebih jauh seperti Teluk Kimi (Samabusa) atau Uwapa (Topo), pengiriman memakan waktu sekitar 2 hingga 4 jam. Pelanggan dapat melacak status pesanan secara real-time melalui menu Cek Pesanan.',
    keyPoints: [
      'Estimasi pengiriman 1-3 jam untuk wilayah Nabire Kota & Barat',
      'Jadwal pengiriman dapat diatur khusus untuk agenda pengecoran massal',
      'Sopir armada akan menghubungi Anda sebelum dump truck berangkat'
    ]
  },
  {
    id: 'faq_5',
    category: 'pembayaran',
    categoryLabel: 'Prosedur & Pembayaran',
    question: 'Bagaimana prosedur pembayaran dengan sistem COD (Cash on Delivery)?',
    answer: 'Sistem COD sangat mudah: Anda cukup melakukan pemesanan melalui website atau WhatsApp dan memilih metode pembayaran COD. Admin kami akan mengonfirmasi antrean dump truck. Pembayaran baru Anda lakukan secara tunai atau transfer instan saat material tiba di lokasi proyek dan muatan rit telah Anda periksa bersama sopir armada.',
    keyPoints: [
      'Bayar saat material tiba di lokasi proyek Anda',
      'Cek muatan rit dan mutu material sebelum melakukan pembayaran',
      'Tersedia pembayaran tunai kepada sopir atau transfer ke rekening resmi'
    ]
  },
  {
    id: 'faq_6',
    category: 'pembayaran',
    categoryLabel: 'Prosedur & Pembayaran',
    question: 'Metode pembayaran apa saja yang disediakan di website CV KAMINDIPMAN?',
    answer: 'Kami menyediakan tiga pilihan metode pembayaran yang aman dan fleksibel: 1) Pembayaran Online Otomatis melalui simulasi gateway Midtrans/Xendit dengan QRIS Dinamis dan Virtual Account Bank resmi (BCA, Mandiri, BRI, BNI), 2) Pembayaran COD saat armada tiba di lokasi proyek, dan 3) Pembayaran melalui WhatsApp dengan konfirmasi langsung bersama staf operasional.',
    keyPoints: [
      'Pembayaran Online: QRIS instan & Virtual Account bank nasional',
      'COD: Fleksibel dan aman untuk kontraktor maupun hunian pribadi',
      'Transfer Bank Manual: Bank Papua, Bank Mandiri, dan Bank BRI resmi an CV KAMINDIPMAN'
    ]
  },
  {
    id: 'faq_7',
    category: 'pembayaran',
    categoryLabel: 'Prosedur & Pembayaran',
    question: 'Apakah setiap transaksi pemesanan mendapatkan Nota / Invoice digital resmi?',
    answer: 'Ya, tentu. Setiap pemesanan yang dibuat di website CV KAMINDIPMAN secara otomatis menghasilkan Nota / Invoice digital resmi lengkap dengan Kop Surat Perusahaan, nomor kode pesanan unik (contoh: KMD-202611-1678), rincian jumlah rit, harga satuan resmi, stempel legalitas CV KAMINDIPMAN, dan tombol cetak langsung (Print / Simpan PDF) untuk keperluan administrasi dan SPJ proyek Anda.',
    keyPoints: [
      'Nota digital dengan kop resmi dan stempel basah digital',
      'Rincian harga, jumlah rit, dan alamat pengiriman tercatat lengkap',
      'Dapat dicetak atau disimpan sebagai PDF kapan saja melalui menu Cek Pesanan'
    ]
  },
  {
    id: 'faq_8',
    category: 'proyek',
    categoryLabel: 'Proyek Besar & Kontrak',
    question: 'Bagaimana cara pemesanan volume besar untuk proyek tender / BUMN di Papua Tengah?',
    answer: 'Bagi rekanan kontraktor, instansi pemerintah, atau pengembang yang membutuhkan pasokan puluhan hingga ratusan rit material pasir, batu, sirtu, atau tanah timbunan, CV KAMINDIPMAN siap melayani kontrak berkala dengan jadwal pengiriman terjadwal dan harga volume khusus. Kami didukung alat berat excavator dan dump truck mandiri di Kampung Wangar Makmur untuk memastikan kontinuitas proyek Anda tanpa hambatan stok.',
    keyPoints: [
      'Dukungan kontrak berkala puluhan hingga ratusan rit',
      'Kesiapan excavator dan dump truck operasional setiap hari',
      'Kelengkapan administrasi penawaran harga resmi (SPH) dan tanda terima berkala'
    ]
  },
  {
    id: 'faq_9',
    category: 'pengiriman',
    categoryLabel: 'Wilayah & Armada Pengiriman',
    question: 'Bagaimana jika lokasi proyek kami berada di dalam gang sempit atau jalan tanah lunak?',
    answer: 'Silakan cantumkan kondisi akses jalan proyek Anda pada kolom "Catatan Tambahan untuk Pengiriman" saat mengisi formulir pemesanan. Mandor dan sopir dump truck kami berpengalaman menavigasi jalur di berbagai distrik Nabire dan akan mengoordinasikan titik tumpah material yang paling aman tanpa merusak infrastruktur jalan sekitar.',
    keyPoints: [
      'Tuliskan petunjuk jalan dan lebar akses pada catatan pesanan',
      'Sopir armada siap berkoordinasi sebelum masuk ke jalan lingkungan',
      'Titik bongkar material disepakati bersama mandor lapangan Anda'
    ]
  }
];

interface FAQSectionProps {
  settings?: CompanySettings;
  onGoToOrder?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ settings, onGoToOrder }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    faq_1: true, // Default open first item
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    FAQ_DATA.forEach(item => {
      allOpen[item.id] = true;
    });
    setOpenItems(allOpen);
  };

  const collapseAll = () => {
    setOpenItems({});
  };

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const cleanQuery = searchQuery.trim().toLowerCase();
      if (!cleanQuery) return matchesCategory;

      const matchesSearch = 
        item.question.toLowerCase().includes(cleanQuery) ||
        item.answer.toLowerCase().includes(cleanQuery) ||
        (item.keyPoints && item.keyPoints.some(kp => kp.toLowerCase().includes(cleanQuery)));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const adminPhone = settings?.adminWhatsApp || '6282198765432';

  return (
    <section className="py-16 bg-zinc-950 text-white relative overflow-hidden border-t border-zinc-800" id="faq">
      {/* Subtle industrial background accent */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-950/60 border border-orange-800/60 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-orange-500" />
            <span>Tanya Jawab & Informasi Lengkap</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Temukan jawaban transparan mengenai mutu material Wangar Makmur, wilayah jangkauan dump truck di Nabire, prosedur COD, dan nota resmi.
          </p>
        </div>

        {/* Search Bar & Quick Category Filters */}
        <div className="max-w-2xl mx-auto mb-8 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pertanyaan seputar pasir, rit, ongkir Nabire, COD, nota..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-orange-600 border-orange-500 text-white font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              Semua Topik
            </button>
            <button
              onClick={() => setActiveCategory('kualitas')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeCategory === 'kualitas'
                  ? 'bg-orange-600 border-orange-500 text-white font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Mutu & Rit</span>
            </button>
            <button
              onClick={() => setActiveCategory('pengiriman')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeCategory === 'pengiriman'
                  ? 'bg-orange-600 border-orange-500 text-white font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Pengiriman Nabire</span>
            </button>
            <button
              onClick={() => setActiveCategory('pembayaran')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeCategory === 'pembayaran'
                  ? 'bg-orange-600 border-orange-500 text-white font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Pembayaran & Nota</span>
            </button>
            <button
              onClick={() => setActiveCategory('proyek')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeCategory === 'proyek'
                  ? 'bg-orange-600 border-orange-500 text-white font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Proyek Besar</span>
            </button>
          </div>
        </div>

        {/* Global Expand / Collapse Control */}
        <div className="flex justify-between items-center text-xs text-zinc-400 mb-4 px-1">
          <div>
            Menampilkan <strong className="text-white">{filteredFAQs.length}</strong> pertanyaan
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={expandAll}
              className="text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
            >
              Buka Semua
            </button>
            <span>•</span>
            <button
              onClick={collapseAll}
              className="text-zinc-400 hover:text-white font-semibold cursor-pointer"
            >
              Tutup Semua
            </button>
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 mb-12">
          {filteredFAQs.map((faq) => {
            const isOpen = !!openItems[faq.id];
            return (
              <div
                key={faq.id}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-zinc-900/90 border-orange-600/50 shadow-lg shadow-orange-950/20'
                    : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-start gap-3">
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-orange-400 border border-zinc-700/80 shrink-0">
                      {faq.categoryLabel}
                    </span>
                    <span className="font-bold text-sm sm:text-base text-white hover:text-orange-300 transition-colors">
                      {faq.question}
                    </span>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-transform duration-200 ${
                      isOpen
                        ? 'bg-orange-600 border-orange-500 text-white rotate-180'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 animate-in fade-in duration-200">
                    <p className="mt-2 text-zinc-200/90 leading-relaxed">
                      {faq.answer}
                    </p>

                    {faq.keyPoints && faq.keyPoints.length > 0 && (
                      <div className="mt-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 space-y-1.5">
                        <div className="text-[11px] font-bold text-orange-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-orange-500" />
                          <span>Poin Penting:</span>
                        </div>
                        {faq.keyPoints.map((point, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty state for search */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12 bg-zinc-900/40 rounded-2xl border border-zinc-800 mb-12">
            <HelpCircle className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm text-zinc-300 font-bold">Tidak ada pertanyaan yang sesuai pencarian.</p>
            <p className="text-xs text-zinc-500 mt-1">Coba kata kunci lain atau langsung hubungi admin WhatsApp CV KAMINDIPMAN.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Reset Filter Pencarian
            </button>
          </div>
        )}

        {/* Direct WhatsApp & Order Consultation Banner */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-orange-950/30 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-400 uppercase tracking-wider">
              <MessageCircle className="w-3.5 h-3.5 text-orange-500" />
              <span>Belum Menemukan Jawaban?</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Konsultasikan Kebutuhan Rit & Lokasi Proyek Anda
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
              Tim operasional tambang CV KAMINDIPMAN siap memberikan informasi harga terkini, ketersediaan dump truck, dan jadwal pengiriman ke lokasi proyek Anda di Nabire.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${adminPhone}?text=${encodeURIComponent('Halo CV KAMINDIPMAN, saya ingin menanyakan informasi pemesanan material dan spesifikasi proyek di Nabire.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/50 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Tanya WhatsApp Admin</span>
            </a>

            {onGoToOrder && (
              <button
                onClick={onGoToOrder}
                className="inline-flex items-center gap-2 px-5 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-950/50 transition-colors cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Pesan Material Sekarang</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
