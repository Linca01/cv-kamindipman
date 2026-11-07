import React, { useState } from 'react';
import { 
  Images, 
  ZoomIn, 
  X, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';
import { HERO_IMAGE } from '../data/initialData';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'pasir' | 'batu' | 'sirtu' | 'tanah' | 'quarry';
  categoryLabel: string;
  imageUrl: string;
  location: string;
  description: string;
  specs: string;
  recommendedFor: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-pasir-01',
    title: 'Pasir Sungai Bersih Alami Wangar Makmur',
    category: 'pasir',
    categoryLabel: 'Pasir Cor & Bangunan',
    imageUrl: '/src/assets/images/product_pasir_1794022010015.jpg',
    location: 'Quarry Kampung Wangar Makmur, Nabire Barat',
    description: 'Deposit aluvial pasir sungai dengan butiran tajam, minim lumpur (<3%), sangat ideal untuk struktur beton bertulang K-250 dan plesteran dinding halus.',
    specs: 'Gradasi 0.15 - 4.75 mm · Kadar Lumpur Rendah · Warna Alami Abu Gelap',
    recommendedFor: 'Pengecoran dak, balok, tiang beton, adukan batako',
  },
  {
    id: 'gal-batu-02',
    title: 'Batu Kali Belah & Andesit Keras Fondasi',
    category: 'batu',
    categoryLabel: 'Batu Belah & Fondasi',
    imageUrl: '/src/assets/images/product_batu_1794022009634.jpg',
    location: 'Deposit Batuan Keras Wangar Makmur, Nabire Barat',
    description: 'Batuan andesit dan kali keras dengan daya dukung tekan tinggi, tahan cuaca ekstrem tanah Papua, menjamin kestabilan fondasi lajur tahan gempa.',
    specs: 'Ukuran 15 - 30 cm (Belah) & Agregat Split · Massa Jenis ±1.65 ton/m³',
    recommendedFor: 'Fondasi rumah, ruko bertingkat, talud penahan tebing & jembatan',
  },
  {
    id: 'gal-sirtu-03',
    title: 'Sirtu Gradasi Padat Perkerasan Jalan',
    category: 'sirtu',
    categoryLabel: 'Sirtu Pengerasan Jalan',
    imageUrl: '/src/assets/images/product_sirtu_1794022010667.jpg',
    location: 'Stockpile Sirtu Alam Wangar Makmur, Nabire Barat',
    description: 'Campuran proporsional alami antara kerikil bundar dan pasir pengikat yang langsung memadat mengunci saat digilas vibro roller tanpa licin.',
    specs: 'Gradasi Butir Kasar-Halus Seimbang · Bebas Sampah Organik',
    recommendedFor: 'Jalan logistik perkebunan, jalan desa, perumahan, urugan lantai dasar',
  },
  {
    id: 'gal-tanah-04',
    title: 'Tanah Timbunan Padas Merah Super Padat',
    category: 'tanah',
    categoryLabel: 'Tanah Timbunan Padas',
    imageUrl: '/src/assets/images/product_tanah_timbunan_1794022011281.jpg',
    location: 'Bukit Galian Padas Wangar Makmur, Nabire Barat',
    description: 'Tanah timbunan merah padat bukan gambut atau lumpur basah. Memberikan daya dukung tanah yang stabil untuk peninggian peil tapak bangunan.',
    specs: 'Lempung Berpasir Padas · Kering & Cepat Padat · Nilai CBR Tinggi',
    recommendedFor: 'Reklamasi lahan rawa, pemerataan pekarangan, tapak gudang',
  },
  {
    id: 'gal-quarry-05',
    title: 'Armada Dump Truck & Stockpile Tambang Wangar',
    category: 'quarry',
    categoryLabel: 'Kuari & Armada Pengangkut',
    imageUrl: HERO_IMAGE,
    location: 'Depo Utama CV KAMINDIPMAN, Wangar Makmur, Nabire Barat',
    description: 'Kesiapan armada dump truck mandiri muatan rit penuh (±4-5 m³) serta alat berat excavator siaga setiap hari untuk pengiriman cepat se-Kabupaten Nabire.',
    specs: 'Armada Dump Truck Roda 6 · Muatan Munjung · Dilengkapi Terpal Pengaman',
    recommendedFor: 'Pengiriman langsung ke seluruh distrik Nabire & sekitarnya',
  },
];

interface MaterialGalleryProps {
  onGoToOrder: (productId?: string) => void;
}

export const MaterialGallery: React.FC<MaterialGalleryProps> = ({ onGoToOrder }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = activeFilter === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  return (
    <section className="py-16 bg-zinc-950 text-white" id="galeri-material">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-600/20 text-orange-400 border border-orange-500/30 uppercase tracking-wider">
              <Images className="w-3.5 h-3.5" />
              <span>Dokumentasi Material & Kuari Wangar</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Galeri Kualitas Material CV KAMINDIPMAN
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Foto riil penampakan fisik material galian C alami dari kuari Kampung Wangar Makmur, Nabire Barat. Kami menjamin kejujuran takaran rit dan mutu material terbaik.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-orange-600 border-orange-600 text-white font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Semua Foto
            </button>
            <button
              onClick={() => setActiveFilter('pasir')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeFilter === 'pasir'
                  ? 'bg-orange-600 border-orange-600 text-white font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Pasir
            </button>
            <button
              onClick={() => setActiveFilter('batu')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeFilter === 'batu'
                  ? 'bg-orange-600 border-orange-600 text-white font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Batu Kali
            </button>
            <button
              onClick={() => setActiveFilter('sirtu')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeFilter === 'sirtu'
                  ? 'bg-orange-600 border-orange-600 text-white font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Sirtu
            </button>
            <button
              onClick={() => setActiveFilter('tanah')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeFilter === 'tanah'
                  ? 'bg-orange-600 border-orange-600 text-white font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Tanah Padas
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-orange-500/50 shadow-md transition-all duration-300 flex flex-col cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-800">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-zinc-950/80 backdrop-blur-md text-[10px] font-bold text-orange-400 border border-zinc-700 uppercase tracking-wider">
                  {item.categoryLabel}
                </span>

                <div className="absolute bottom-3 right-3 p-2 rounded-full bg-zinc-950/80 text-white group-hover:bg-orange-600 transition-colors shadow">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-extrabold text-base text-white group-hover:text-orange-400 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 text-[11px] font-mono">
                    {item.specs.split('·')[0]}
                  </span>
                  <span className="text-orange-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Lihat Detail</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedItem && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
            onClick={() => setSelectedItem(null)}
          >
            <div 
              className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] bg-zinc-950 overflow-hidden">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white cursor-pointer transition-colors"
                  aria-label="Tutup jendela galeri"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 rounded bg-orange-600 text-white font-bold text-xs shadow">
                    {selectedItem.categoryLabel}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-white">{selectedItem.title}</h3>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span>{selectedItem.location}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {selectedItem.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                      Spesifikasi Material:
                    </span>
                    <span className="text-zinc-300 font-mono mt-0.5 block">
                      {selectedItem.specs}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                      Peruntukan Pekerjaan:
                    </span>
                    <span className="text-orange-300 mt-0.5 block">
                      {selectedItem.recommendedFor}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      onGoToOrder();
                    }}
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Pesan Material Ini</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
