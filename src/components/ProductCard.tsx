import React from 'react';
import { ShoppingCart, MessageCircle, Check, ArrowRight, Truck } from 'lucide-react';
import { Product, CompanySettings } from '../types';
import { formatRupiah, generateWhatsAppDirectUrl } from '../utils/orderCalculator';

interface ProductCardProps {
  product: Product;
  onOrderNow: (product: Product, rit: number) => void;
  onAddToCart: (product: Product, rit: number) => void;
  settings: CompanySettings;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOrderNow,
  onAddToCart,
  settings,
}) => {
  const [selectedRit, setSelectedRit] = React.useState<number>(3);
  const [addedNotice, setAddedNotice] = React.useState(false);

  const ritPresets = [1, 2, 3, 5, 10];

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedRit);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleWhatsAppInquiry = () => {
    const msg = [
      'Halo CV KAMINDIPMAN, saya ingin menanyakan harga dan memesan material berikut:',
      '',
      `Produk: ${product.name}`,
      `Jumlah Kebutuhan: ${selectedRit} rit`,
      `Harga Tercantum: ${formatRupiah(product.pricePerRit)} per rit`,
      `Perkiraan Total: ${formatRupiah(product.pricePerRit * selectedRit)}`,
      '',
      'Mohon konfirmasi ketersediaan stok di Quarry Wangar Makmur dan jadwal pengiriman ke lokasi kami.',
    ].join('\n');

    const url = generateWhatsAppDirectUrl(settings.adminWhatsApp, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
      <div>
        {/* Product Image Frame */}
        <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-sm text-zinc-100 text-xs font-semibold px-2.5 py-1 rounded">
            {product.category === 'pasir' && 'Pasir Alami Nabire'}
            {product.category === 'batu' && 'Batu Belah & Fondasi'}
            {product.category === 'sirtu' && 'Sirtu Pengerasan Jalan'}
            {product.category === 'tanah_timbunan' && 'Tanah Timbunan Padas'}
          </div>

          <div className="absolute bottom-3 right-3 bg-zinc-950/90 text-orange-400 font-mono text-xs font-bold px-2.5 py-1 rounded shadow">
            {product.available ? 'Stok Tersedia di Quarry' : 'Hubungi Admin'}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
              {product.shortDescription}
            </p>
          </div>

          {/* Pricing Highlight */}
          <div className="bg-zinc-50 rounded-lg p-3.5 border border-zinc-200">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-zinc-500">Harga Resmi / Rit:</span>
              <span className="text-2xl font-black text-zinc-900 font-mono tabular-nums tracking-tight">
                {formatRupiah(product.pricePerRit)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-1">
              <Truck className="w-3.5 h-3.5 text-orange-600" />
              <span>Satuan: {product.unit}</span>
            </div>
          </div>

          {/* Use cases list */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider block">
              Kegunaan Material:
            </span>
            <ul className="text-xs text-zinc-600 space-y-1">
              {product.useCases.map((use, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                  <span>{use}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Rit Selector */}
          <div className="pt-2 border-t border-zinc-100">
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Pilihan Jumlah Rit:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ritPresets.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRit(r)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                    selectedRit === r
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {r} Rit
                </button>
              ))}
            </div>

            {/* Custom Rit Input */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-zinc-500">Jumlah lain:</span>
              <input
                type="number"
                min="1"
                max="100"
                value={selectedRit}
                onChange={(e) => setSelectedRit(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 px-2 py-1 text-center border border-zinc-300 rounded text-xs font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <span className="text-xs text-zinc-600 font-medium font-mono">
                = {formatRupiah(product.pricePerRit * selectedRit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Exact 3 Buttons required by prompt */}
      <div className="p-5 pt-0 space-y-2">
        {/* Button 1: Pesan Sekarang */}
        <button
          type="button"
          onClick={() => onOrderNow(product, selectedRit)}
          className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <span>Pesan Sekarang ({selectedRit} Rit)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* 2-Column Buttons for Cart & WhatsApp */}
        <div className="grid grid-cols-2 gap-2">
          {/* Button 2: Tambah ke Keranjang */}
          <button
            type="button"
            onClick={handleAddToCartClick}
            className={`py-2 px-3 border rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              addedNotice
                ? 'bg-emerald-50 border-emerald-400 text-emerald-700 font-bold'
                : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-800'
            }`}
          >
            {addedNotice ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ditambahkan!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5 text-zinc-600" />
                <span>+ Keranjang</span>
              </>
            )}
          </button>

          {/* Button 3: Tanya Harga Melalui WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsAppInquiry}
            className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Tanya WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
