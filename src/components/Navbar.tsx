import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, ShieldCheck, Menu, X, Phone, Search, Calculator, ArrowRight } from 'lucide-react';
import { CompanySettings, Product } from '../types';
import { useLanguage, LanguageToggle } from '../context/LanguageContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
  settings: CompanySettings;
  isAdmin: boolean;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onOpenEstimator?: () => void;
  products?: Product[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  settings,
  isAdmin,
  searchQuery = '',
  setSearchQuery,
  onOpenEstimator,
  products = [],
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const navLinks = [
    { id: 'beranda', label: t('nav_home') },
    { id: 'produk', label: t('nav_products') },
    { id: 'pemesanan', label: t('nav_order') },
    { id: 'cek-pesanan', label: t('nav_tracking') },
    { id: 'riwayat-pesanan', label: t('nav_history') },
    { id: 'tentang-kami', label: t('nav_about') },
    { id: 'kontak', label: t('nav_contact') },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setIsSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (val: string) => {
    if (setSearchQuery) {
      setSearchQuery(val);
    }
    if (val.trim() && activeTab !== 'produk') {
      setActiveTab('produk');
    }
  };

  const searchResults = searchQuery.trim() && products.length > 0
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <header className="sticky top-0 z-40 bg-zinc-950 border-b border-zinc-800 text-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 lg:gap-6">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('beranda')}
              className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
              aria-label="Kembali ke Beranda CV KAMINDIPMAN"
            >
              <div className="w-10 h-10 rounded bg-orange-600 flex items-center justify-center font-black text-xl text-white tracking-wider shadow-md group-hover:bg-orange-500 transition-colors">
                K
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-lg lg:text-xl tracking-tight text-white group-hover:text-orange-400 transition-colors leading-none">
                  CV KAMINDIPMAN
                </span>
                <span className="text-[10px] sm:text-[11px] text-zinc-400 font-medium tracking-wider uppercase mt-1">
                  Material Bangunan Nabire
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-6 text-xs lg:text-sm font-semibold tracking-wide text-zinc-300">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-colors whitespace-nowrap py-1 relative cursor-pointer ${
                  activeTab === link.id
                    ? 'text-orange-500 font-bold'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                {link.label}
                {activeTab === link.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Global Search Bar (Desktop) */}
          <div className="hidden md:flex relative flex-1 max-w-xs lg:max-w-sm">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t('nav_search_placeholder')}
                className="w-full pl-9 pr-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 focus:border-orange-500 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            {/* Quick Live Search Results Dropdown */}
            {searchQuery.trim().length > 0 && searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-1.5 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-zinc-800">
                <div className="p-2 bg-zinc-950 text-[10px] font-bold uppercase text-orange-400 tracking-wider">
                  Hasil Material Ditemukan ({searchResults.length})
                </div>
                {searchResults.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setActiveTab('produk');
                      setSearchQuery?.(p.name);
                    }}
                    className="p-2.5 hover:bg-zinc-800 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={p.imageUrl} alt={p.name} className="w-7 h-7 rounded object-cover shrink-0" />
                      <div className="truncate">
                        <div className="text-xs font-bold text-white truncate">{p.name}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">Rp {p.pricePerRit.toLocaleString('id-ID')} / rit</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Zone 4: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Language Toggle (ID / EN) */}
            <LanguageToggle />

            {/* Estimator Button */}
            {onOpenEstimator && (
              <button
                onClick={onOpenEstimator}
                className="hidden lg:inline-flex items-center gap-1.5 p-2 px-2.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Kalkulator Estimasi Kebutuhan Rit (P x L)"
              >
                <Calculator className="w-4 h-4 text-orange-500" />
                <span className="hidden xl:inline">{t('estimator_btn')}</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
              aria-label={`Keranjang belanja: ${cartCount} barang`}
            >
              <ShoppingCart className="w-5 h-5 text-zinc-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Quick Order CTA */}
            <button
              onClick={() => handleNavClick('pemesanan')}
              className="hidden sm:inline-flex items-center justify-center px-3.5 py-2 text-xs lg:text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-sm hover:shadow transition-colors whitespace-nowrap cursor-pointer"
            >
              {t('nav_order_cta')}
            </button>

            {/* Admin Portal Switch */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-orange-950/60 border-orange-500/50 text-orange-400'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
              title="Portal Admin CV KAMINDIPMAN"
              aria-label="Akses Dashboard Admin"
            >
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span className="hidden sm:inline text-xs font-semibold">{t('nav_admin')}</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Buka menu navigasi"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-zinc-950 border-b border-zinc-800 px-4 pt-2 pb-6 space-y-3">
          
          {/* Mobile Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t('nav_search_placeholder')}
              className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="space-y-1 pt-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`block w-full text-left px-3 py-2.5 rounded-md text-base font-medium transition-colors cursor-pointer ${
                  activeTab === link.id
                    ? 'bg-orange-600/10 text-orange-500 font-bold border-l-2 border-orange-500'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2">
            {onOpenEstimator && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEstimator();
                }}
                className="w-full py-2.5 px-4 text-center text-xs font-bold text-orange-400 bg-orange-950/40 border border-orange-800/60 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>{t('estimator_btn')}</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('pemesanan')}
              className="w-full py-2.5 px-4 text-center text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow cursor-pointer"
            >
              {t('nav_order_cta')}
            </button>

            <a
              href={`https://wa.me/${settings.adminWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 text-center text-sm font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 rounded-lg flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              WhatsApp Admin (+{settings.adminWhatsApp})
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

