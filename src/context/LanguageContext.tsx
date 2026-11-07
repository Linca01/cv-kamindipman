import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'id' | 'en';

interface Translations {
  [key: string]: {
    id: string;
    en: string;
  };
}

export const TRANSLATIONS: Translations = {
  // Navbar
  nav_home: { id: 'Beranda', en: 'Home' },
  nav_products: { id: 'Produk', en: 'Products' },
  nav_order: { id: 'Pemesanan', en: 'Order Now' },
  nav_tracking: { id: 'Cek Pesanan', en: 'Track Order' },
  nav_history: { id: 'Riwayat Pesanan', en: 'Order History' },
  nav_about: { id: 'Tentang Kami', en: 'About Us' },
  nav_contact: { id: 'Kontak', en: 'Contact' },
  nav_admin: { id: 'Admin', en: 'Admin' },
  nav_order_cta: { id: 'Pesan Sekarang', en: 'Order Now' },
  nav_search_placeholder: { id: 'Cari pasir, batu, sirtu, timbunan...', en: 'Search sand, stone, gravel, soil...' },

  // Hero
  hero_tag: { id: 'Quarry: Kampung Wangar Makmur, Nabire Barat', en: 'Quarry: Wangar Makmur Village, West Nabire' },
  hero_title: { id: 'Supplier Material Bangunan Terpercaya Nabire', en: 'Trusted Building Material Supplier in Nabire' },
  hero_subtitle: { 
    id: 'CV KAMINDIPMAN menyediakan suplai Pasir Sungai Bersih, Batu Fondasi Keras, Sirtu Pengerasan Jalan, dan Tanah Timbunan Padas langsung dari sumber tambang galian di Kampung Wangar Makmur, Nabire Barat.',
    en: 'CV KAMINDIPMAN provides pure river sand, hard foundation stone, road base course, and solid fill soil directly from our alluvial quarry in Wangar Makmur, West Nabire.'
  },
  hero_order_btn: { id: 'Pesan Sekarang', en: 'Order Now' },
  hero_catalog_btn: { id: 'Lihat Semua Produk', en: 'View All Products' },
  hero_wa_btn: { id: 'WhatsApp Admin', en: 'WhatsApp Admin' },

  // Estimator CTA
  estimator_btn: { id: 'Kalkulator Estimasi (P × L)', en: 'Material Estimator (L × W)' },
  
  // Footer
  footer_about_text: {
    id: 'Perusahaan supplier material tambang galian C dan bahan konstruksi terpercaya di Nabire, Papua Tengah. Melayani pengadaan pasir cor, batu fondasi, sirtu jalan, dan tanah timbunan proyek.',
    en: 'Trusted category C quarry material and construction supplier in Nabire, Central Papua. Supplying concrete sand, foundation stone, road base course, and project fill soil.'
  },
  footer_quick_links: { id: 'Navigasi Halaman', en: 'Quick Navigation' },
  footer_products: { id: 'Produk Material', en: 'Material Products' },
  footer_contact: { id: 'Lokasi & Kontak', en: 'Location & Contact' },
  footer_legal: { id: 'Legalitas Resmi Usaha Konstruksi Nabire', en: 'Official Registered Construction Business in Nabire' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'id',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kmd_lang');
      if (saved === 'en' || saved === 'id') return saved;
    }
    return 'id';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kmd_lang', lang);
    }
  };

  const t = (key: string): string => {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[language] || entry.id || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer shadow-xs"
      title={language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
      aria-label="Ganti bahasa website"
    >
      <span className="text-sm leading-none">{language === 'id' ? '🇮🇩' : '🇬🇧'}</span>
      <span className="uppercase tracking-wider font-mono font-bold text-[11px]">
        {language === 'id' ? 'ID' : 'EN'}
      </span>
    </button>
  );
};
