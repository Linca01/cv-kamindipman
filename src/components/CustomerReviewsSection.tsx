import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  MessageSquarePlus, 
  X, 
  Send, 
  Sparkles, 
  MapPin, 
  Clock, 
  AlertCircle, 
  Check, 
  Filter, 
  ThumbsUp,
  Search,
  ChevronDown,
  ChevronUp,
  PackageCheck,
  Quote
} from 'lucide-react';
import { TestimonialItem, Order } from '../types';
import { storageService } from '../services/storageService';

interface CustomerReviewsSectionProps {
  onGoToOrder?: () => void;
  onTrackOrder?: (orderCode: string) => void;
  preSelectedOrderCode?: string;
}

export const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = ({
  onGoToOrder,
  onTrackOrder,
  preSelectedOrderCode,
}) => {
  const [reviews, setReviews] = useState<TestimonialItem[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Review Form States
  const [orderCodeInput, setOrderCodeInput] = useState<string>(preSelectedOrderCode || '');
  const [verifiedOrder, setVerifiedOrder] = useState<Order | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Form Fields
  const [reviewerName, setReviewerName] = useState<string>('');
  const [role, setRole] = useState<string>('Kontraktor Bangunan');
  const [companyOrProject, setCompanyOrProject] = useState<string>('');
  const [district, setDistrict] = useState<string>('Nabire Kota');
  const [category, setCategory] = useState<'kontraktor' | 'jalan' | 'hunian'>('kontraktor');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [content, setContent] = useState<string>('');
  const [materialSupplied, setMaterialSupplied] = useState<string>('');
  const [verifiedVolume, setVerifiedVolume] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Filter States
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | 'all'>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load reviews and completed orders
  const loadData = () => {
    setReviews(storageService.getTestimonials());
    setCompletedOrders(storageService.getCompletedOrders());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = storageService.subscribe((scope) => {
      if (scope === 'testimonials' || scope === 'orders' || scope === 'reset' || scope === 'all') {
        loadData();
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle preSelectedOrderCode if passed from props
  useEffect(() => {
    if (preSelectedOrderCode) {
      setOrderCodeInput(preSelectedOrderCode);
      handleVerifyCode(preSelectedOrderCode);
      setIsModalOpen(true);
    }
  }, [preSelectedOrderCode]);

  const handleVerifyCode = (codeToVerify?: string) => {
    const targetCode = (codeToVerify || orderCodeInput).trim();
    if (!targetCode) {
      setVerificationError('Silakan masukkan kode transaksi pesanan Anda (contoh: KMD-202611-1015).');
      setVerifiedOrder(null);
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    // Call storageService verification
    const res = storageService.verifyCompletedOrder(targetCode);

    if (res.success && res.order) {
      setVerifiedOrder(res.order);
      setVerificationError(null);
      // Auto-populate form from the verified completed order
      setReviewerName(res.order.customerName);
      setDistrict(res.order.deliveryDistrict);
      const itemsList = res.order.items.map(i => i.productName).join(' + ');
      setMaterialSupplied(itemsList);
      const totalRit = res.order.items.reduce((acc, i) => acc + i.rit, 0);
      setVerifiedVolume(`${totalRit} Rit`);
      setCompanyOrProject(`Proyek di ${res.order.deliveryDistrict}`);
    } else {
      setVerifiedOrder(null);
      setVerificationError(res.message);
    }
    setIsVerifying(false);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!verifiedOrder) {
      setSubmitError('Harap verifikasi kode pesanan Anda terlebih dahulu untuk memastikan pesanan telah selesai.');
      return;
    }

    if (!reviewerName.trim()) {
      setSubmitError('Mohon isi nama lengkap Anda.');
      return;
    }

    if (!content.trim() || content.trim().length < 15) {
      setSubmitError('Ulasan Anda terlalu singkat. Mohon tuliskan ulasan minimal 15 karakter.');
      return;
    }

    const res = storageService.submitVerifiedReview({
      orderCode: verifiedOrder.orderCode,
      name: reviewerName.trim(),
      role: role.trim(),
      companyOrProject: companyOrProject.trim(),
      district: district.trim(),
      category,
      rating,
      materialSupplied,
      verifiedVolume,
      content: content.trim(),
    });

    if (res.success) {
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsModalOpen(false);
        // Reset form
        setOrderCodeInput('');
        setVerifiedOrder(null);
        setContent('');
        setRating(5);
      }, 3000);
    } else {
      setSubmitError(res.message);
    }
  };

  // Metrics Calculation
  const metrics = useMemo(() => {
    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return {
        avgRating: 5.0,
        totalReviews: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        percentages: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    reviews.forEach((r) => {
      const star = Math.max(1, Math.min(5, Math.round(r.rating)));
      dist[star] = (dist[star] || 0) + 1;
      sum += r.rating;
    });

    const avg = Number((sum / totalReviews).toFixed(1));

    const pcts: Record<number, number> = {
      5: Math.round((dist[5] / totalReviews) * 100),
      4: Math.round((dist[4] / totalReviews) * 100),
      3: Math.round((dist[3] / totalReviews) * 100),
      2: Math.round((dist[2] / totalReviews) * 100),
      1: Math.round((dist[1] / totalReviews) * 100),
    };

    return {
      avgRating: avg,
      totalReviews,
      distribution: dist,
      percentages: pcts,
    };
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      // 1. Star filter
      if (selectedStarFilter !== 'all' && Math.round(r.rating) !== selectedStarFilter) {
        return false;
      }
      // 2. Category filter
      if (selectedCategoryFilter !== 'all' && r.category !== selectedCategoryFilter) {
        return false;
      }
      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = r.name.toLowerCase().includes(q);
        const matchContent = r.content.toLowerCase().includes(q);
        const matchMaterial = r.materialSupplied.toLowerCase().includes(q);
        const matchDistrict = r.district.toLowerCase().includes(q);
        const matchOrderCode = r.orderCode?.toLowerCase().includes(q) || false;
        return matchName || matchContent || matchMaterial || matchDistrict || matchOrderCode;
      }
      return true;
    });
  }, [reviews, selectedStarFilter, selectedCategoryFilter, searchQuery]);

  const getRatingFeedbackText = (val: number) => {
    switch (val) {
      case 5:
        return '⭐ 5/5 - Sangat Puas (Kualitas Material & Rit Terpenuhi Sesuai Harapan)';
      case 4:
        return '⭐ 4/5 - Puas (Pelayanan & Pengiriman Dump Truck Bagus)';
      case 3:
        return '⭐ 3/5 - Cukup Baik';
      case 2:
        return '⭐ 2/5 - Perlu Peningkatan';
      case 1:
        return '⭐ 1/5 - Kurang Memuaskan';
      default:
        return '';
    }
  };

  return (
    <section className="py-16 bg-zinc-950 text-white relative overflow-hidden" id="ulasan-pelanggan">
      {/* Subtle backdrop pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-950/70 border border-orange-800/80 px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            <span>Transparansi Kepuasan Pelanggan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ulasan Pelanggan Terverifikasi
          </h2>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            Hanya pelanggan yang pesanannya telah berstatus <strong>"Pesanan Selesai"</strong> yang dapat memberikan rating dan ulasan. Bukti nyata kejujuran ritase dump truck dan kualitas material CV KAMINDIPMAN di Nabire.
          </p>

          {/* Trigger Button to Open Verified Review Modal */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setIsModalOpen(true);
                setSubmitSuccess(false);
                setSubmitError(null);
                setVerificationError(null);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xl shadow-orange-950/60 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Tulis Ulasan (Khusus Pesanan Selesai)</span>
              <span className="bg-orange-700/80 text-[10px] uppercase font-black px-2 py-0.5 rounded-md text-orange-100">
                1-5 Bintang
              </span>
            </button>

            {onGoToOrder && (
              <button
                onClick={onGoToOrder}
                className="inline-flex items-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs sm:text-sm font-semibold rounded-xl border border-zinc-800 transition-colors cursor-pointer"
              >
                <Truck className="w-4 h-4 text-orange-400" />
                <span>Pesan Material Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* Rating Overview & Trust Metrics Bar */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 mb-10 shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Overall Score (4 cols) */}
            <div className="lg:col-span-4 text-center lg:text-left lg:border-r border-zinc-800 lg:pr-8">
              <div className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight flex items-baseline justify-center lg:justify-start gap-2">
                <span>{metrics.avgRating.toFixed(1)}</span>
                <span className="text-xl text-zinc-500 font-sans font-medium">/ 5.0</span>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-1 my-2.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(metrics.avgRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-zinc-700 fill-zinc-800'
                    }`}
                  />
                ))}
              </div>

              <div className="text-xs text-zinc-400">
                Berdasarkan <strong>{metrics.totalReviews} ulasan</strong> dari kontraktor, instansi, & warga di seluruh Nabire.
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center justify-center lg:justify-start gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-semibold">100% Pembeli Nyata Terverifikasi</span>
              </div>
            </div>

            {/* Middle: Star Distribution Bars (5 cols) */}
            <div className="lg:col-span-5 space-y-2 text-xs">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedStarFilter(selectedStarFilter === star ? 'all' : star)}
                    className="flex items-center gap-1 font-mono text-zinc-400 hover:text-white transition-colors w-16 text-left cursor-pointer"
                  >
                    <span>{star}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </button>

                  <div className="flex-1 bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        star >= 4 ? 'bg-orange-500' : star === 3 ? 'bg-amber-500' : 'bg-zinc-600'
                      }`}
                      style={{ width: `${metrics.percentages[star]}%` }}
                    />
                  </div>

                  <span className="w-10 text-right font-mono text-[11px] text-zinc-400">
                    {metrics.percentages[star]}%
                  </span>
                </div>
              ))}
            </div>

            {/* Right: Key Value Badges (3 cols) */}
            <div className="lg:col-span-3 bg-zinc-950/70 p-4 rounded-xl border border-zinc-800 space-y-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Muatan Munjung ±4-5 m³</div>
                  <div className="text-[11px] text-zinc-500">Takaran rit jujur dan padat</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Armada Dump Truck Siap</div>
                  <div className="text-[11px] text-zinc-500">Jadwal pengecoran tepat waktu</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Kuari Wangar Makmur</div>
                  <div className="text-[11px] text-zinc-500">Deposit alami bermutu tinggi</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category & Star Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => {
                setSelectedStarFilter('all');
                setSelectedCategoryFilter('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedStarFilter === 'all' && selectedCategoryFilter === 'all'
                  ? 'bg-orange-600 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Semua ({reviews.length})
            </button>

            <button
              onClick={() => setSelectedStarFilter(selectedStarFilter === 5 ? 'all' : 5)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedStarFilter === 5
                  ? 'bg-amber-500 text-zinc-950 font-black'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>5 Bintang</span>
            </button>

            <button
              onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === 'kontraktor' ? 'all' : 'kontraktor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategoryFilter === 'kontraktor'
                  ? 'bg-orange-600 text-white font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Kontraktor Gedung
            </button>

            <button
              onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === 'jalan' ? 'all' : 'jalan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategoryFilter === 'jalan'
                  ? 'bg-orange-600 text-white font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Jalan & Urugan
            </button>

            <button
              onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === 'hunian' ? 'all' : 'hunian')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategoryFilter === 'hunian'
                  ? 'bg-orange-600 text-white font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Hunian / Ruko
            </button>
          </div>

          {/* Search Reviews Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari ulasan kontraktor, pasir, rit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((item) => (
            <div
              key={item.id}
              className={`bg-zinc-900/90 rounded-2xl p-6 border transition-all flex flex-col justify-between space-y-4 shadow-xl relative group ${
                item.isNew
                  ? 'border-orange-500 ring-1 ring-orange-500/50 bg-gradient-to-b from-orange-950/20 to-zinc-900'
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {item.isNew && (
                <div className="absolute -top-3 right-6 bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Ulasan Baru</span>
                </div>
              )}

              <div className="space-y-3">
                
                {/* Verified Header Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-zinc-800/80 pb-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Pembeli Terverifikasi (Pesanan Selesai)</span>
                  </div>

                  {item.orderCode && (
                    <span className="font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded text-[10px] border border-zinc-800">
                      Nota: {item.orderCode}
                    </span>
                  )}
                </div>

                {/* Rating & Material Spec */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1" aria-label={`Rating ${item.rating} dari 5 bintang`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= item.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-zinc-700 fill-zinc-800'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-amber-400 ml-1 font-mono">
                      {item.rating}.0
                    </span>
                  </div>

                  <div className="text-xs text-orange-400 font-medium">
                    {item.materialSupplied} <span className="text-zinc-400 font-mono">({item.verifiedVolume})</span>
                  </div>
                </div>

                {/* Content Quote */}
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed italic">
                  "{item.content}"
                </p>
              </div>

              {/* Author & Location Lockup */}
              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-white text-sm group-hover:text-orange-400 transition-colors">
                    {item.name}
                  </div>
                  <div className="text-zinc-400 font-medium text-[11px]">{item.role}</div>
                  <div className="text-zinc-500 text-[11px]">{item.companyOrProject}</div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded text-[11px] text-zinc-300 font-medium">
                    <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                    <span>{item.district}</span>
                  </span>
                  {item.createdAt && (
                    <div className="text-[10px] text-zinc-500 mt-1 font-mono">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Empty state if search or filter yields nothing */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-16 bg-zinc-900/60 rounded-2xl border border-zinc-800">
            <Quote className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-zinc-300">Tidak ada ulasan yang cocok</h3>
            <p className="text-xs text-zinc-500 mt-1">Coba gunakan kata kunci lain atau reset filter bintang Anda.</p>
            <button
              onClick={() => {
                setSelectedStarFilter('all');
                setSelectedCategoryFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-lg hover:bg-orange-500 transition-colors cursor-pointer"
            >
              Reset Filter Ulasan
            </button>
          </div>
        )}

        {/* Bottom CTA Card */}
        <div className="mt-12 text-center bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-xl">
          <h4 className="text-base sm:text-lg font-bold text-white mb-2">
            Punya Pesanan yang Telah Selesai Dikirim?
          </h4>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto mb-5 leading-relaxed">
            Masukkan kode nota pesanan Anda untuk memverifikasi transaksi dan berikan ulasan objektif mengenai mutu pasir cor, batu fondasi, sirtu jalan, atau tanah timbunan kami.
          </p>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setSubmitSuccess(false);
              setSubmitError(null);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-950/60 transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Kirim Ulasan & Rating Pesanan Selesai</span>
          </button>
        </div>

      </div>

      {/* ================= MODAL: SUBMIT VERIFIED REVIEW ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-orange-600/50 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Beri Ulasan Pelanggan Terverifikasi</h3>
                  <p className="text-xs text-zinc-400">Khusus pesanan yang telah tuntas dikirim & berstatus "Pesanan Selesai"</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
                aria-label="Tutup modal ulasan"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Message Banner */}
            {submitSuccess && (
              <div className="mb-6 p-4 bg-emerald-950/90 border border-emerald-600 rounded-xl flex items-start gap-3 text-emerald-200 text-xs sm:text-sm animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-300 text-sm">Terima Kasih Atas Ulasan Anda!</div>
                  <p className="mt-0.5 text-emerald-200/90">
                    Ulasan Anda telah berhasil diverifikasi dan dipublikasikan di halaman beranda dengan lencana <strong>"Pembeli Terverifikasi"</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message Banner */}
            {submitError && (
              <div className="mb-6 p-3 bg-red-950/80 border border-red-700 rounded-xl text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-5">
              
              {/* STEP 1: ORDER CODE VERIFICATION */}
              <div className="bg-zinc-900/90 p-4 rounded-xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-zinc-200">
                    1. Masukkan Kode Pesanan Anda <span className="text-orange-500">*</span>
                  </label>
                  <span className="text-[11px] text-zinc-400">
                    Lihat kode pada nota digital atau WhatsApp
                  </span>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Contoh: KMD-202611-1015"
                      value={orderCodeInput}
                      onChange={(e) => {
                        setOrderCodeInput(e.target.value);
                        setVerificationError(null);
                      }}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white uppercase font-mono placeholder:normal-case placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleVerifyCode()}
                    disabled={isVerifying}
                    className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow transition-colors cursor-pointer shrink-0"
                  >
                    {isVerifying ? 'Memeriksa...' : 'Verifikasi Pesanan'}
                  </button>
                </div>

                {/* Quick Helper: Completed Orders in System */}
                {completedOrders.length > 0 && !verifiedOrder && (
                  <div className="pt-2 border-t border-zinc-800/70 text-[11px] text-zinc-400">
                    <span className="font-semibold text-zinc-300">Pilihan Cepat Pesanan Selesai Anda:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {completedOrders.map((co) => (
                        <button
                          key={co.id}
                          type="button"
                          onClick={() => {
                            setOrderCodeInput(co.orderCode);
                            handleVerifyCode(co.orderCode);
                          }}
                          className="px-2.5 py-1 bg-zinc-950 hover:bg-orange-950 hover:border-orange-600 border border-zinc-800 rounded-lg text-[10px] text-orange-400 font-mono transition-colors cursor-pointer"
                        >
                          {co.orderCode} ({co.customerName})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verification Error Feedback */}
                {verificationError && (
                  <div className="p-3 bg-red-950/70 border border-red-800 rounded-xl text-xs text-red-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{verificationError}</span>
                  </div>
                )}

                {/* Verification Success Feedback */}
                {verifiedOrder && (
                  <div className="p-3.5 bg-emerald-950/80 border border-emerald-700 rounded-xl space-y-1.5 animate-in fade-in">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Terverifikasi: Pesanan Selesai (#{verifiedOrder.orderCode})</span>
                    </div>
                    <div className="text-[11px] text-emerald-200/90 pl-6 space-y-0.5">
                      <div>Pemesan: <strong>{verifiedOrder.customerName}</strong> · Wilayah: <strong>{verifiedOrder.deliveryDistrict}</strong></div>
                      <div>Material: <strong>{verifiedOrder.items.map(i => `${i.productName} (${i.rit} Rit)`).join(', ')}</strong></div>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 2: REVIEW DETAILS (Disabled until order is verified) */}
              <div className={`space-y-4 transition-opacity ${!verifiedOrder ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                
                {/* Rating 1-5 Stars */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    2. Berikan Penilaian / Rating Bintang (1 - 5) <span className="text-orange-500">*</span>
                  </label>
                  <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5">
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const isFilled = (hoverRating || rating) >= starValue;
                      return (
                        <button
                          key={starValue}
                          type="button"
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(starValue)}
                          className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                          aria-label={`Beri ${starValue} bintang`}
                        >
                          <Star 
                            className={`w-6 h-6 ${isFilled ? 'fill-amber-400 stroke-amber-400' : 'stroke-zinc-600 fill-none'}`} 
                          />
                        </button>
                      );
                    })}
                    <span className="text-sm font-bold text-amber-400 ml-3 font-mono">
                      {hoverRating || rating} / 5 Bintang
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1 font-medium">
                    {getRatingFeedbackText(hoverRating || rating)}
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    3. Isi Ulasan & Pengalaman Lapangan <span className="text-orange-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Ceritakan pengalaman Anda: mutu pasir/batu/sirtu Wangar Makmur, muatan munjung dump truck, ketepatan waktu pengiriman, atau kemudahan koordinasi via WhatsApp..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors leading-relaxed"
                  />
                  <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                    <span>Minimal 15 karakter pengalaman nyata.</span>
                    <span>{content.length} karakter</span>
                  </div>
                </div>

                {/* Reviewer Details Confirmation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Nama Pengulas / Pemesan
                    </label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Profesi / Peran Proyek
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="Kontraktor Bangunan">Kontraktor Bangunan</option>
                      <option value="Kontraktor Sipil & Jalan">Kontraktor Sipil & Jalan</option>
                      <option value="Mandor Proyek Lapangan">Mandor Proyek Lapangan</option>
                      <option value="Pemilik Rumah Pribadi">Pemilik Rumah / Ruko Pribadi</option>
                      <option value="Pengawas Proyek">Pengawas Proyek / Konsultan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Nama Perusahaan / Proyek (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: CV Papua Karya Mandiri / Rumah Tinggal"
                      value={companyOrProject}
                      onChange={(e) => setCompanyOrProject(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Kategori Proyek
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setCategory('kontraktor')}
                        className={`py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                          category === 'kontraktor'
                            ? 'bg-orange-600 text-white border-orange-500'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                        }`}
                      >
                        Gedung
                      </button>
                      <button
                        type="button"
                        onClick={() => setCategory('jalan')}
                        className={`py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                          category === 'jalan'
                            ? 'bg-orange-600 text-white border-orange-500'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                        }`}
                      >
                        Jalan
                      </button>
                      <button
                        type="button"
                        onClick={() => setCategory('hunian')}
                        className={`py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                          category === 'hunian'
                            ? 'bg-orange-600 text-white border-orange-500'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                        }`}
                      >
                        Hunian
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded-xl border border-zinc-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={!verifiedOrder || submitSuccess}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim & Publikasikan Ulasan</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
};
