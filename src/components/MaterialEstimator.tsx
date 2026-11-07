import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Ruler, 
  Layers, 
  Truck, 
  ArrowRight, 
  MessageCircle, 
  CheckCircle2, 
  Info, 
  RotateCcw,
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';
import { Product } from '../types';
import { formatRupiah, generateWhatsAppDirectUrl } from '../utils/orderCalculator';

export interface MaterialEstimatorProps {
  products: Product[];
  onApplyEstimate: (productId: string, rit: number) => void;
  adminWhatsApp: string;
  initialProductId?: string;
  onClose?: () => void;
  isModal?: boolean;
}

interface ProjectPreset {
  id: string;
  name: string;
  defaultThicknessCm: number;
  recommendedCategory: 'pasir' | 'batu' | 'sirtu' | 'tanah_timbunan';
  description: string;
}

const PRESETS: ProjectPreset[] = [
  {
    id: 'cor_dak',
    name: 'Pengecoran Lantai / Dak Beton',
    defaultThicknessCm: 12,
    recommendedCategory: 'pasir',
    description: 'Pengecoran plat dak lantai, rabat beton, atau sloof gantung (tebal 10-15 cm).',
  },
  {
    id: 'jalan_sirtu',
    name: 'Perkerasan Jalan Proyek (Sirtu)',
    defaultThicknessCm: 15,
    recommendedCategory: 'sirtu',
    description: 'Lapisan subgrade jalan akses perumahan / perkebunan yang digilas vibro.',
  },
  {
    id: 'urug_lahan',
    name: 'Pengurugan / Penimbunan Lahan',
    defaultThicknessCm: 30,
    recommendedCategory: 'tanah_timbunan',
    description: 'Pemerataan lahan rawa pekarangan atau tapak gudang logistik.',
  },
  {
    id: 'fondasi_batu',
    name: 'Fondasi Batu Belah Kali',
    defaultThicknessCm: 50,
    recommendedCategory: 'batu',
    description: 'Pekerjaan pasangan batu kali lajur untuk pondasi rumah tinggal tahan gempa.',
  },
  {
    id: 'custom',
    name: 'Kustom / Input Bebas',
    defaultThicknessCm: 10,
    recommendedCategory: 'pasir',
    description: 'Tentukan panjang, lebar, dan ketebalan material sesuai kebutuhan spesifik Anda.',
  },
];

export const MaterialEstimator: React.FC<MaterialEstimatorProps> = ({
  products,
  onApplyEstimate,
  adminWhatsApp,
  initialProductId,
  onClose,
  isModal = false,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('cor_dak');
  const [lengthMeters, setLengthMeters] = useState<number>(10);
  const [widthMeters, setWidthMeters] = useState<number>(6);
  const [thicknessCm, setThicknessCm] = useState<number>(12);
  
  // Choose target product
  const defaultProduct = products.find(p => p.id === initialProductId) || products[0];
  const [selectedProductId, setSelectedProductId] = useState<string>(defaultProduct ? defaultProduct.id : '');

  const activeProduct = products.find(p => p.id === selectedProductId) || products[0];

  // When preset changes, update thickness & product category recommendation
  const handleSelectPreset = (preset: ProjectPreset) => {
    setSelectedPreset(preset.id);
    if (preset.id !== 'custom') {
      setThicknessCm(preset.defaultThicknessCm);
      const matched = products.find(p => p.category === preset.recommendedCategory);
      if (matched) {
        setSelectedProductId(matched.id);
      }
    }
  };

  // Calculations:
  // 1. Luas = P * L (m2)
  // 2. Volume Padat = P * L * (T / 100) (m3)
  // 3. Safety/Compaction factor: +15% (1.15) for loose volume & shrinkage
  // 4. Dump truck capacity: ~4.5 m3 per rit
  // 5. Suggested rit = Math.ceil(Volume Total / 4.5)
  const calculation = useMemo(() => {
    const p = Math.max(0.1, lengthMeters || 0);
    const l = Math.max(0.1, widthMeters || 0);
    const t = Math.max(1, thicknessCm || 1) / 100; // in meters

    const areaM2 = p * l;
    const solidVolumeM3 = areaM2 * t;
    const compactionFactor = 1.15; // 15% safety and compaction
    const totalVolumeM3 = solidVolumeM3 * compactionFactor;
    const dumpTruckM3 = 4.5; // Standard CV KAMINDIPMAN dump truck volume
    const estimatedRit = Math.max(1, Math.ceil(totalVolumeM3 / dumpTruckM3));
    const estimatedCost = activeProduct ? estimatedRit * activeProduct.pricePerRit : 0;

    return {
      areaM2: Number(areaM2.toFixed(1)),
      solidVolumeM3: Number(solidVolumeM3.toFixed(2)),
      totalVolumeM3: Number(totalVolumeM3.toFixed(2)),
      dumpTruckM3,
      estimatedRit,
      estimatedCost,
    };
  }, [lengthMeters, widthMeters, thicknessCm, activeProduct]);

  const handleConsultWhatsApp = () => {
    const text = `Halo CV KAMINDIPMAN, saya menggunakan Kalkulator Estimasi Kebutuhan Material:\n- Proyek: ${lengthMeters}m x ${widthMeters}m (Tebal: ${thicknessCm}cm)\n- Luas: ${calculation.areaM2} m² (Volume ± ${calculation.totalVolumeM3} m³)\n- Rekomendasi: ${calculation.estimatedRit} Rit ${activeProduct?.name || 'Material'}\nMohon konfirmasi ketersediaan armada dump truck dan jadwal muat ke Nabire.`;
    const url = generateWhatsAppDirectUrl(adminWhatsApp, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleApply = () => {
    if (activeProduct) {
      onApplyEstimate(activeProduct.id, calculation.estimatedRit);
      if (onClose) onClose();
    }
  };

  const content = (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200 uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Kalkulator Luas & Volume Ritasi</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
            Estimator Kebutuhan Material (P × L × T)
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1">
            Hitung perkiraan jumlah rit dump truck (±4-5 m³) yang dibutuhkan untuk proyek Anda di Nabire secara cepat dan akurat.
          </p>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
            aria-label="Tutup kalkulator"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Preset Selection Buttons */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
          1. Pilih Jenis Pekerjaan Konstruksi:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                selectedPreset === preset.id
                  ? 'bg-orange-600 text-white border-orange-600 font-bold shadow-sm'
                  : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-800'
              }`}
            >
              <div className="font-semibold leading-tight">{preset.name}</div>
              <div className={`text-[10px] mt-1 ${selectedPreset === preset.id ? 'text-orange-100' : 'text-zinc-500'}`}>
                Tebal ±{preset.defaultThicknessCm} cm
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dimensional Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-50 p-4 sm:p-5 rounded-2xl border border-zinc-200">
        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center justify-between">
            <span>Panjang Area (P):</span>
            <span className="text-orange-600 font-mono font-bold">{lengthMeters} Meter</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={lengthMeters}
              onChange={(e) => setLengthMeters(Math.max(0.1, Number(e.target.value)))}
              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl font-mono text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-medium">
              meter
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Panjang sisi lokasi kerja</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center justify-between">
            <span>Lebar Area (L):</span>
            <span className="text-orange-600 font-mono font-bold">{widthMeters} Meter</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={widthMeters}
              onChange={(e) => setWidthMeters(Math.max(0.1, Number(e.target.value)))}
              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl font-mono text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-medium">
              meter
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Lebar bentang lokasi</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center justify-between">
            <span>Tebal / Kedalaman (T):</span>
            <span className="text-orange-600 font-mono font-bold">{thicknessCm} cm</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              step="1"
              value={thicknessCm}
              onChange={(e) => setThicknessCm(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl font-mono text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-medium">
              cm
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Ketebalan hamparan material</p>
        </div>
      </div>

      {/* Target Material Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
          2. Pilih Material yang Ingin Dihitung:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {products.map((prod) => (
            <button
              key={prod.id}
              type="button"
              onClick={() => setSelectedProductId(prod.id)}
              className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                selectedProductId === prod.id
                  ? 'bg-orange-50/70 border-orange-500 ring-2 ring-orange-500/30'
                  : 'bg-white hover:bg-zinc-50 border-zinc-200'
              }`}
            >
              <img
                src={prod.imageUrl}
                alt={prod.name}
                className="w-11 h-11 rounded-lg object-cover border border-zinc-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-zinc-900 truncate">{prod.name}</div>
                <div className="text-[11px] font-mono text-orange-600 font-bold mt-0.5">
                  {formatRupiah(prod.pricePerRit)} <span className="text-zinc-500 font-normal">/ rit</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Result Cards & Estimation Summary */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white rounded-2xl p-5 sm:p-6 border border-zinc-800 shadow-xl space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="text-xs text-orange-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hasil Analisa Volume Proyek</span>
            </div>
            <div className="text-sm text-zinc-300 mt-0.5">
              Dimensi: <strong className="text-white">{lengthMeters}m × {widthMeters}m</strong> (Luas: {calculation.areaM2} m²) · Tebal: <strong className="text-white">{thicknessCm} cm</strong>
            </div>
          </div>

          <div className="bg-zinc-800/80 border border-zinc-700 px-3 py-1.5 rounded-xl text-xs text-zinc-300 self-start sm:self-auto">
            <span>Faktor Padat/Susut: </span>
            <strong className="text-orange-400">+15%</strong> (Standar Sipil)
          </div>
        </div>

        {/* 3 Metric Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-900/90 p-4 rounded-xl border border-zinc-800">
            <div className="text-xs text-zinc-400 font-medium">Volume Kebutuhan Riil</div>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {calculation.totalVolumeM3} <span className="text-sm font-bold text-zinc-400">m³</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Termasuk cadangan susut 15%</div>
          </div>

          <div className="bg-orange-950/60 p-4 rounded-xl border border-orange-500/40">
            <div className="text-xs text-orange-300 font-bold uppercase tracking-wider flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-orange-400" />
              <span>Rekomendasi Ritase</span>
            </div>
            <div className="text-3xl font-black text-orange-400 font-mono mt-1">
              {calculation.estimatedRit} <span className="text-base font-bold text-white">Rit</span>
            </div>
            <div className="text-[11px] text-orange-200/70 mt-0.5">Dump truck standar ±4.5 m³</div>
          </div>

          <div className="bg-zinc-900/90 p-4 rounded-xl border border-zinc-800">
            <div className="text-xs text-zinc-400 font-medium">Estimasi Biaya Material</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-1 truncate">
              {formatRupiah(calculation.estimatedCost)}
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Belum termasuk ongkir distrik</div>
          </div>
        </div>

        {/* Technical Explanatory Note */}
        <div className="text-xs text-zinc-400 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/80 flex items-start gap-2">
          <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px] sm:text-xs">
            Perhitungan menggunakan takaran muatan munjung dump truck CV KAMINDIPMAN (±4.5 m³ per rit). Untuk pengecoran struktural kolom dan balok, disarankan berkonsultasi langsung dengan mandor quarry kami untuk penyesuaian rasio agregat kasar dan halus.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleConsultWhatsApp}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Konsultasi Estimasi via WA</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
          >
            <span>Pesan Sekarang ({calculation.estimatedRit} Rit)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-zinc-200">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-sm">
      {content}
    </div>
  );
};
