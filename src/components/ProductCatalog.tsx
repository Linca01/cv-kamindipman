import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Calculator, ChevronDown, ChevronUp, Sparkles, Images } from 'lucide-react';
import { Product, CompanySettings } from '../types';
import { ProductCard } from './ProductCard';
import { MaterialEstimator } from './MaterialEstimator';

interface ProductCatalogProps {
  products: Product[];
  onOrderNow: (product: Product, rit: number) => void;
  onAddToCart: (product: Product, rit: number) => void;
  settings: CompanySettings;
  externalSearchQuery?: string;
  onOpenGallery?: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onOrderNow,
  onAddToCart,
  settings,
  externalSearchQuery = '',
  onOpenGallery,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState(externalSearchQuery);
  const [showEstimator, setShowEstimator] = useState(false);

  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  const categories = [
    { id: 'all', label: 'Semua Material' },
    { id: 'pasir', label: 'Pasir Bangunan & Cor' },
    { id: 'batu', label: 'Batu Belah & Pecah' },
    { id: 'sirtu', label: 'Sirtu Jalan' },
    { id: 'tanah_timbunan', label: 'Tanah Timbunan' },
  ];

  const filteredProducts = products.filter((prod) => {
    const matchesCat = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.useCases.some((u) => u.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <section className="py-12 bg-zinc-50 text-zinc-900" id="katalog-produk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Katalog Resmi CV KAMINDIPMAN</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Produk Material Konstruksi Pilihan
          </h2>
          <p className="text-sm text-zinc-600 mt-2">
            Material tambang galian C alami bermutu tinggi dari Wangar Makmur, Nabire Barat. Tentukan jumlah rit sesuai kebutuhan proyek Anda.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Segmented Category Buttons */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-200/80 rounded-xl w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari material cor, fondasi, jalan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
            />
          </div>
        </div>

        {/* Estimator Integration Strip */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                  Bingung Menghitung Berapa Rit yang Anda Butuhkan?
                </h3>
                <p className="text-xs text-orange-100 mt-0.5">
                  Masukkan ukuran panjang & lebar proyek Anda untuk kalkulasi ritasi dump truck otomatis (+15% faktor aman pemadatan).
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowEstimator(!showEstimator)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer whitespace-nowrap self-stretch sm:self-auto justify-center"
            >
              <span>{showEstimator ? 'Tutup Estimator' : 'Buka Kalkulator (P × L)'}</span>
              {showEstimator ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Collapsible Estimator Card */}
          {showEstimator && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <MaterialEstimator
                products={products}
                onApplyEstimate={(prodId, rit) => {
                  const prod = products.find(p => p.id === prodId);
                  if (prod) {
                    onOrderNow(prod, rit);
                  }
                }}
                adminWhatsApp={settings.adminWhatsApp}
                onClose={() => setShowEstimator(false)}
              />
            </div>
          )}
        </div>

        {/* Products Grid: 3 or 4 columns based on viewport */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOrderNow={onOrderNow}
              onAddToCart={onAddToCart}
              settings={settings}
            />
          ))}
        </div>

        {/* Info box below products */}
        <div className="mt-12 p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-sm text-zinc-900">
              Butuh pasokan material volume besar untuk proyek tender / BUMN di Nabire?
            </h4>
            <p className="text-zinc-500">
              Kami siap melayani kontrak berkala ratusan rit dengan kesiapan dump truck dan excavator setiap hari kerja.
            </p>
          </div>
          <a
            href={`https://wa.me/${settings.adminWhatsApp}?text=${encodeURIComponent('Halo CV KAMINDIPMAN, kami dari kontraktor ingin berkonsultasi pengadaan material proyek volume besar.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg shadow whitespace-nowrap transition-colors"
          >
            Konsultasi Kontrak Proyek
          </a>
        </div>

      </div>
    </section>
  );
};
