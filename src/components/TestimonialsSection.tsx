import React, { useState, useEffect } from 'react';
import { 
  Quote, 
  Star, 
  CheckCircle, 
  Truck, 
  PlusCircle, 
  X, 
  Send, 
  Sparkles, 
  MessageSquarePlus, 
  ChevronDown, 
  ChevronUp,
  MapPin,
  Clock
} from 'lucide-react';
import { TestimonialItem } from '../types';
import { storageService } from '../services/storageService';

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('Kontraktor Bangunan');
  const [customRole, setCustomRole] = useState('');
  const [companyOrProject, setCompanyOrProject] = useState('');
  const [district, setDistrict] = useState('Distrik Nabire Kota');
  const [category, setCategory] = useState<'kontraktor' | 'jalan' | 'hunian'>('kontraktor');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [materialSupplied, setMaterialSupplied] = useState('Pasir Bangunan & Pengecoran');
  const [verifiedVolume, setVerifiedVolume] = useState('5 Rit');
  const [content, setContent] = useState('');
  const [isVerifiedCheck, setIsVerifiedCheck] = useState<boolean>(true);

  // Load testimonials from storage
  useEffect(() => {
    const loadData = () => {
      setTestimonials(storageService.getTestimonials());
    };

    loadData();
    const unsubscribe = storageService.subscribe((scope) => {
      if (scope === 'testimonials' || scope === 'reset' || scope === 'all') {
        loadData();
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredTestimonials = testimonials.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const getCategoryLabel = (cat: 'kontraktor' | 'jalan' | 'hunian') => {
    switch (cat) {
      case 'kontraktor':
        return 'Kontraktor Gedung';
      case 'jalan':
        return 'Infrastruktur Jalan';
      case 'hunian':
        return 'Hunian & Ruko';
      default:
        return 'Proyek Konstruksi';
    }
  };

  const getRatingFeedbackText = (stars: number) => {
    switch (stars) {
      case 5:
        return '⭐ 5/5 - Sangat Puas (Kualitas Material & Rit Dump Truck Tepat)';
      case 4:
        return '⭐ 4/5 - Puas (Pelayanan & Pengiriman Bagus)';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!name.trim()) {
      setFormError('Silakan masukkan nama lengkap atau nama perwakilan Anda.');
      return;
    }

    const finalRole = role === 'Lainnya' ? customRole.trim() || 'Pelanggan Material' : role;

    if (!content.trim() || content.trim().length < 15) {
      setFormError('Mohon tulis ulasan atau pengalaman Anda minimal 15 karakter.');
      return;
    }

    if (!isVerifiedCheck) {
      setFormError('Mohon centang pernyataan persetujuan pengalaman pemesanan.');
      return;
    }

    // Add to storage
    const newTestimonial = storageService.addTestimonial({
      name: name.trim(),
      role: finalRole,
      companyOrProject: companyOrProject.trim() || 'Proyek Swadaya Masyarakat',
      district: district.trim(),
      category,
      categoryLabel: getCategoryLabel(category),
      rating,
      materialSupplied: materialSupplied.trim(),
      verifiedVolume: verifiedVolume.trim() ? `${verifiedVolume.replace(/rit/gi, '').trim()} Rit` : '1 Rit',
      content: content.trim(),
    });

    // Reset form and show success
    setSubmitSuccess(true);
    setName('');
    setCompanyOrProject('');
    setContent('');
    setRating(5);
    setVerifiedVolume('5 Rit');

    // Auto close success after 6 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsFormOpen(false);
    }, 4000);
  };

  return (
    <section className="py-16 bg-zinc-900 text-white relative overflow-hidden" id="testimoni">
      {/* Subtle backdrop mesh */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-950/60 border border-orange-800/60 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Quote className="w-3.5 h-3.5 text-orange-500" />
            <span>Testimoni & Kepercayaan Mitra Proyek</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Pengalaman Klien & Kontraktor di Nabire
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Bukti nyata kepuasan rekanan kontraktor, pengembang infrastruktur, dan masyarakat Papua Tengah terhadap kualitas material serta ketepatan rit CV KAMINDIPMAN.
          </p>

          {/* Trigger Button to Open Submission Form */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setIsFormOpen(!isFormOpen);
                setSubmitSuccess(false);
                setFormError(null);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-orange-950/50 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>{isFormOpen ? 'Tutup Formulir Ulasan' : 'Bagikan Pengalaman / Tulis Ulasan Anda'}</span>
              {isFormOpen ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </button>
            <a
              href="#form-pemesanan"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm font-semibold rounded-xl border border-zinc-700 transition-colors"
            >
              <Truck className="w-4 h-4 text-orange-400" />
              <span>Pesan Material Sekarang</span>
            </a>
          </div>
        </div>

        {/* Form Panel (Collapsible Card with Smooth Industrial Styling) */}
        {isFormOpen && (
          <div className="mb-12 max-w-3xl mx-auto bg-zinc-950 border border-orange-600/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative transition-all animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Formulir Ulasan & Pengalaman Pelanggan</h3>
                  <p className="text-xs text-zinc-400">Bagikan testimoni Anda mengenai layanan dump truck dan mutu material kami di Nabire</p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
                aria-label="Tutup formulir"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Alert */}
            {submitSuccess && (
              <div className="mb-6 p-4 bg-emerald-950/80 border border-emerald-700 rounded-xl flex items-start gap-3 text-emerald-200 text-xs sm:text-sm animate-in fade-in">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-300 text-sm">Terima kasih atas ulasan Anda!</div>
                  <p className="mt-0.5 text-emerald-200/90 leading-relaxed">
                    Testimoni Anda telah berhasil disimpan dan langsung dipublikasikan pada daftar ulasan mitra CV KAMINDIPMAN di bawah.
                  </p>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {formError && (
              <div className="mb-6 p-3 bg-red-950/80 border border-red-700 rounded-xl text-xs text-red-200 flex items-center gap-2">
                <span className="font-bold text-red-400">Perhatian:</span>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Row 1: Nama & Peran */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Nama Lengkap / Kontak <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Bpk. Marthen Tabuni"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Profesi / Jabatan <span className="text-orange-500">*</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="Kontraktor Bangunan">Kontraktor Bangunan / Gedung</option>
                    <option value="Kontraktor Sipil & Jalan">Kontraktor Sipil & Jalan</option>
                    <option value="Mandor Proyek Lapangan">Mandor Proyek Lapangan</option>
                    <option value="Pemilik Rumah Pribadi">Pemilik Rumah / Ruko Pribadi</option>
                    <option value="Pengawas Lapangan">Pengawas / Konsultan Pengawas</option>
                    <option value="Lainnya">Lainnya (Ketik Manual)</option>
                  </select>
                </div>
              </div>

              {/* Custom Role Input if 'Lainnya' selected */}
              {role === 'Lainnya' && (
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Tulis Jabatan / Peran Anda
                  </label>
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="Contoh: Toko Bangunan Mitra Nabire"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              )}

              {/* Row 2: Perusahaan/Proyek & Distrik */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Nama Perusahaan / Proyek <span className="text-zinc-500 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={companyOrProject}
                    onChange={(e) => setCompanyOrProject(e.target.value)}
                    placeholder="Contoh: CV Papua Prima / Renovasi Ruko Oyehe"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Distrik / Wilayah di Nabire <span className="text-orange-500">*</span>
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="Distrik Nabire Kota">Distrik Nabire Kota (Kalibobo, Oyehe, Karang Mulia)</option>
                    <option value="Distrik Nabire Barat">Distrik Nabire Barat (Wangar Makmur, Kalisusu, Bumi Mulia)</option>
                    <option value="Distrik Teluk Kimi">Distrik Teluk Kimi (Samabusa & Pelabuhan)</option>
                    <option value="Distrik Uwapa">Distrik Uwapa (Topo & Trans Nabire)</option>
                    <option value="Distrik Wanggar">Distrik Wanggar</option>
                    <option value="Distrik Makimi">Distrik Makimi (Legari)</option>
                    <option value="Distrik Yaur">Distrik Yaur</option>
                    <option value="Wilayah Nabire Lainnya">Wilayah Nabire Lainnya</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Kategori Proyek & Jenis Material */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Kategori Proyek <span className="text-orange-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCategory('kontraktor')}
                      className={`px-2 py-2 rounded-xl text-center text-xs font-semibold border transition-all cursor-pointer ${
                        category === 'kontraktor'
                          ? 'bg-orange-600/30 border-orange-500 text-orange-300 font-bold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Gedung
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory('jalan')}
                      className={`px-2 py-2 rounded-xl text-center text-xs font-semibold border transition-all cursor-pointer ${
                        category === 'jalan'
                          ? 'bg-orange-600/30 border-orange-500 text-orange-300 font-bold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Jalan/Urug
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory('hunian')}
                      className={`px-2 py-2 rounded-xl text-center text-xs font-semibold border transition-all cursor-pointer ${
                        category === 'hunian'
                          ? 'bg-orange-600/30 border-orange-500 text-orange-300 font-bold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Rumah/Ruko
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Jenis Material yang Dipesan <span className="text-orange-500">*</span>
                  </label>
                  <select
                    value={materialSupplied}
                    onChange={(e) => setMaterialSupplied(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="Pasir Bangunan & Pengecoran">Pasir Bangunan & Pengecoran Cor</option>
                    <option value="Batu Belah & Pecah Fondasi">Batu Belah & Batu Pecah Fondasi</option>
                    <option value="Sirtu Pengerasan Jalan">Sirtu (Pasir Batu Pengerasan Jalan)</option>
                    <option value="Tanah Timbunan & Lahan">Tanah Timbunan & Pemerataan Lahan</option>
                    <option value="Pasir Cor & Batu Belah">Kombinasi: Pasir Cor + Batu Belah</option>
                    <option value="Sirtu & Tanah Timbunan">Kombinasi: Sirtu + Tanah Timbunan</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Volume Rit & Rating Bintang */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Perkiraan Volume Dipesan <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={verifiedVolume}
                    onChange={(e) => setVerifiedVolume(e.target.value)}
                    placeholder="Contoh: 10 Rit (Dump Truck)"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Penilaian / Rating Kepuasan <span className="text-orange-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2">
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const isFilled = (hoverRating || rating) >= starValue;
                      return (
                        <button
                          key={starValue}
                          type="button"
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(starValue)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                          aria-label={`Pilih ${starValue} bintang`}
                        >
                          <Star 
                            className={`w-5 h-5 ${isFilled ? 'fill-amber-400 stroke-amber-400' : 'stroke-zinc-600 fill-none'}`} 
                          />
                        </button>
                      );
                    })}
                    <span className="text-[11px] font-bold text-amber-400 ml-2 font-mono">
                      {hoverRating || rating} / 5
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1 font-medium">
                    {getRatingFeedbackText(hoverRating || rating)}
                  </div>
                </div>
              </div>

              {/* Textarea Ulasan */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  Isi Ulasan & Pengalaman Lapangan <span className="text-orange-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Ceritakan pengalaman Anda: mutu pasir/batu/sirtu, muatan munjung dump truck, ketepatan waktu pengiriman dari Wangar Makmur, atau kemudahan pemesanan via website & WhatsApp..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors leading-relaxed"
                />
                <div className="flex justify-between items-center text-[11px] text-zinc-500 mt-1">
                  <span>Minimal 15 karakter. Kejujuran Anda sangat membantu kemajuan kontraktor Nabire.</span>
                  <span>{content.length} karakter</span>
                </div>
              </div>

              {/* Checkbox Persetujuan */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="verifiedCheck"
                  checked={isVerifiedCheck}
                  onChange={(e) => setIsVerifiedCheck(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-orange-600 border-zinc-700 bg-zinc-900 focus:ring-orange-500 cursor-pointer"
                />
                <label htmlFor="verifiedCheck" className="text-xs text-zinc-400 cursor-pointer select-none">
                  Saya menyatakan bahwa ulasan ini adalah pengalaman nyata pemesanan material dengan <strong className="text-zinc-200">CV KAMINDIPMAN</strong> di wilayah Nabire dan sekitarnya.
                </label>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs sm:text-sm font-semibold rounded-xl border border-zinc-700 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-orange-950/60 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim & Publikasikan Ulasan</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Quantitative Proof Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 text-center">
          <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800">
            <div className="text-2xl sm:text-3xl font-black text-orange-500 font-mono">1.450+</div>
            <div className="text-xs font-bold text-zinc-200 mt-1">Rit Terkirim Aman</div>
            <div className="text-[11px] text-zinc-500">Se-Kabupaten Nabire</div>
          </div>
          <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">99.2%</div>
            <div className="text-xs font-bold text-zinc-200 mt-1">Ketepatan Waktu Cor</div>
            <div className="text-[11px] text-zinc-500">Armada siaga jadwal</div>
          </div>
          <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800">
            <div className="text-2xl sm:text-3xl font-black text-orange-500 font-mono">100%</div>
            <div className="text-xs font-bold text-zinc-200 mt-1">Muatan Rit Munjung</div>
            <div className="text-[11px] text-zinc-500">Dump truck ±4-5 m³</div>
          </div>
          <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {testimonials.length > 0
                ? (
                    testimonials.reduce((acc, curr) => acc + curr.rating, 0) /
                    testimonials.length
                  ).toFixed(1)
                : '4.9'}{' '}
              / 5.0
            </div>
            <div className="text-xs font-bold text-zinc-200 mt-1">
              {testimonials.length} Ulasan Terverifikasi
            </div>
            <div className="text-[11px] text-zinc-500">Rating mitra kontraktor</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-zinc-950 border border-zinc-800 rounded-xl gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-orange-600 text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Semua Ulasan ({testimonials.length})
            </button>
            <button
              onClick={() => setActiveFilter('kontraktor')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'kontraktor'
                  ? 'bg-orange-600 text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Kontraktor Gedung
            </button>
            <button
              onClick={() => setActiveFilter('jalan')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'jalan'
                  ? 'bg-orange-600 text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Jalan & Pengurugan
            </button>
            <button
              onClick={() => setActiveFilter('hunian')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'hunian'
                  ? 'bg-orange-600 text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Hunian & Ruko
            </button>
          </div>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              className={`bg-zinc-950 p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 shadow-lg group relative ${
                item.isNew 
                  ? 'border-orange-500 ring-1 ring-orange-500/50 bg-gradient-to-b from-orange-950/20 to-zinc-950' 
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
                {/* Top Badge: Verified Purchase & Material Spec */}
                <div className="flex items-center justify-between text-xs border-b border-zinc-800/80 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-orange-400 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>Terverifikasi: {item.materialSupplied}</span>
                  </div>
                  <span className="font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded text-[11px]">
                    Volume: {item.verifiedVolume}
                  </span>
                </div>

                {/* Stars Rating */}
                <div className="flex items-center gap-1 text-amber-400" aria-label={`Rating ${item.rating} dari 5 bintang`}>
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 stroke-none" />
                  ))}
                  <span className="text-[11px] text-zinc-400 font-mono ml-1 font-semibold">
                    {item.rating}.0
                  </span>
                </div>

                {/* Testimonial Quote */}
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed italic">
                  "{item.content}"
                </p>
              </div>

              {/* Author & Project Lockup */}
              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-white text-sm group-hover:text-orange-400 transition-colors">
                    {item.name}
                  </div>
                  <div className="text-zinc-400 font-medium">{item.role}</div>
                  <div className="text-zinc-500 text-[11px] mt-0.5">{item.companyOrProject}</div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-[11px] text-zinc-300 font-medium">
                    <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                    <span>{item.district}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if filter yields no items */}
        {filteredTestimonials.length === 0 && (
          <div className="text-center py-12 bg-zinc-950/60 rounded-2xl border border-zinc-800">
            <Quote className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm text-zinc-400 font-medium">Belum ada testimoni pada kategori ini.</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-3 text-xs text-orange-400 hover:text-orange-300 font-bold underline cursor-pointer"
            >
              Lihat Semua Ulasan
            </button>
          </div>
        )}

        {/* Bottom Trust Action */}
        <div className="mt-12 text-center bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
          <h4 className="text-base sm:text-lg font-bold text-white mb-2">
            Ingin Mengirimkan Ulasan atau Berkonsultasi Spesifikasi Proyek?
          </h4>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto mb-5 leading-relaxed">
            Armada dump truck kami siaga melayani pemesanan langsung ke seluruh wilayah Nabire dan sekitarnya dari kuari Kampung Wangar Makmur.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setIsFormOpen(true);
                window.scrollTo({ top: document.getElementById('testimoni')?.offsetTop || 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs sm:text-sm rounded-xl border border-zinc-700 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-orange-400" />
              <span>Tulis Ulasan Anda Disini</span>
            </button>
            <a
              href="#form-pemesanan"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-950/60 transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Hitung Kebutuhan Rit & Pesan Material</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
