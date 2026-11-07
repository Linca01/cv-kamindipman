import React from 'react';
import { X, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { formatRupiah } from '../utils/orderCalculator';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateRit: (productId: string, newRit: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateRit,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const totalRit = cartItems.reduce((sum, item) => sum + item.rit, 0);
  const totalSubtotal = cartItems.reduce((sum, item) => sum + item.product.pricePerRit * item.rit, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-5 h-5 text-orange-500" />
              <h2 className="font-extrabold text-base tracking-tight">
                Keranjang Pesanan Material
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-zinc-400 hover:text-white"
              aria-label="Tutup keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <ShoppingCart className="w-12 h-12 text-zinc-300 mx-auto stroke-[1.5]" />
                <p className="font-bold text-zinc-700 text-sm">
                  Keranjang pesanan masih kosong
                </p>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Pilih produk material pasir, batu, sirtu, atau tanah timbunan di katalog untuk mulai memesan.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-lg hover:bg-orange-500"
                >
                  Lihat Produk Material
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex gap-3 items-center"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover border border-zinc-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-zinc-900 truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-xs font-mono text-orange-600 font-bold mt-0.5">
                        {formatRupiah(item.product.pricePerRit)}{' '}
                        <span className="text-zinc-500 font-normal">/ rit</span>
                      </div>

                      {/* Quantity stepper */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateRit(item.product.id, Math.max(1, item.rit - 1))}
                          className="w-6 h-6 rounded bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold text-xs flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="font-bold text-xs font-mono px-1">
                          {item.rit} rit
                        </span>
                        <button
                          onClick={() => onUpdateRit(item.product.id, item.rit + 1)}
                          className="w-6 h-6 rounded bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold text-xs flex items-center justify-center"
                        >
                          +
                        </button>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="ml-auto text-zinc-400 hover:text-red-500 p-1"
                          title="Hapus dari keranjang"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Subtotal & Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-zinc-50 border-t border-zinc-200 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Total Rit Kebutuhan:</span>
                  <span className="font-bold text-zinc-900">{totalRit} Rit Dump Truck</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-zinc-900 pt-1 border-t border-zinc-200">
                  <span>Subtotal Material:</span>
                  <span className="font-mono text-orange-600">
                    {formatRupiah(totalSubtotal)}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 italic">
                  *Ongkir pengiriman akan dihitung saat memilih wilayah di Nabire.
                </p>
              </div>

              <button
                onClick={onCheckout}
                className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Lanjut ke Formulir Pemesanan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
