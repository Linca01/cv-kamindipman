import React, { useState } from 'react';
import { 
  BookOpen, 
  Lightbulb, 
  CheckCircle2, 
  Calculator, 
  ArrowRight, 
  Layers, 
  Hammer, 
  ShieldCheck, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

interface GuideItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  icon: string;
  keySteps: string[];
  civilTip: string;
  recommendedMaterial: string;
}

const PROJECT_TIPS: GuideItem[] = [
  {
    id: 'tip-cor-beton',
    category: 'Struktur & Pengecoran',
    title: 'Panduan Menghitung Rasio Pasir, Kerikil & Semen untuk Cor Dak Tahan Gempa',
    summary: 'Rasio campuran ideal untuk beton struktural mutu K-225 hingga K-250 adalah 1 Semen : 2 Pasir Sungai Bersih : 3 Kerikil/Batu Pecah, ditambah air secukupnya.',
    icon: 'hammer',
    keySteps: [
      'Pastikan pasir bebas lumpur (<3%) seperti pasir tambang Wangar Makmur agar ikatan semen maksimal.',
      'Gunakan perbandingan volume standar: 1 ember semen : 2 ember pasir : 3 ember kerikil.',
      'Tambahkan faktor susut volume 15-20% saat menghitung kebutuhan total ritase material.',
      'Lakukan curing (penyiraman basah) minimal 7-14 hari setelah pengecoran dak agar tidak timbul retak rambut.',
    ],
    civilTip: 'Pasir dengan kadar lumpur tinggi membuat konsumsi semen membengkak dan beton mudah getas saat gempa.',
    recommendedMaterial: 'Pasir Bangunan & Pengecoran CV KAMINDIPMAN',
  },
  {
    id: 'tip-fondasi-batu',
    category: 'Fondasi Bangunan',
    title: 'Standar Kedalaman & Pasangan Batu Kali Belah untuk Tanah Nabire',
    summary: 'Struktur pondasi batu belah trapesium sangat ideal meredam guncangan seismik dan pergeseran tanah lempung di kawasan pesisir dan pedalaman Papua Tengah.',
    icon: 'shield',
    keySteps: [
      'Gali tanah keras dengan kedalaman minimal 60 - 80 cm hingga menemukan lapisan padas stabil.',
      'Beri lapisan pasir urug setebal 5 - 10 cm di dasar parit galian sebagai bantalan peredam (aanstamping).',
      'Susun batu belah keras dengan ukuran 15-25 cm saling mengunci, diisi spesi adukan 1 semen : 4 pasir.',
      'Pasang stek besi angker $\\varnothing 10$ mm setiap jarak 1 meter untuk mengikat sloof beton di atasnya.',
    ],
    civilTip: 'Jangan gunakan batu bulat sungai licin tanpa dibelah karena spesi semen sulit mengikat kuat.',
    recommendedMaterial: 'Batu Belah & Batu Pecah Fondasi CV KAMINDIPMAN',
  },
  {
    id: 'tip-sirtu-jalan',
    category: 'Perkerasan Akses Jalan',
    title: 'Kunci Sukses Pemadatan Lapis Sirtu Jalan Agar Tidak Amblas Saat Hujan',
    summary: 'Material sirtu (pasir batu) alam yang baik harus memiliki percampuran seimbang antara butiran kerikil kasar sebagai penopang beban dan pasir sebagai pengisi rongga.',
    icon: 'layers',
    keySteps: [
      'Kupas lapisan tanah humus atas (topsoil) minimal 20 cm sebelum menghamparkan sirtu.',
      'Hamparkan sirtu secara bertahap dengan ketebalan maksimal 15-20 cm per lapisan.',
      'Basahi sirtu secukupnya hingga mencapai kadar air optimum sebelum digilas vibro roller atau dump truck.',
      'Buat kemiringan melintang jalan 2-3% ke arah parit kiri-kanan agar air hujan segera terbuang.',
    ],
    civilTip: 'Pemadatan lapis tipis bertahap jauh lebih padat mengunci daripada menghampar sekaligus tebal 40 cm.',
    recommendedMaterial: 'Sirtu (Pasir Batu Pengerasan) CV KAMINDIPMAN',
  },
  {
    id: 'tip-timbunan-lahan',
    category: 'Reklamasi & Urugan',
    title: 'Membedakan Karakteristik Tanah Timbunan Padas vs Tanah Biasa',
    summary: 'Untuk peninggian peil pekarangan atau tapak ruko di Nabire, tanah padas merah memiliki daya dukung (CBR) tinggi dan tidak menyusut drastis saat musim hujan.',
    icon: 'lightbulb',
    keySteps: [
      'Hindari menggunakan tanah gambut hitam atau lempung basah sawah yang gembur untuk tapak bangunan.',
      'Gunakan tanah timbunan padas berpasir dari quarry yang bersih dari potongan kayu lapuk dan akar pohon.',
      'Ratakan dengan dozer atau bucket excavator, lalu biarkan padat terlewati dump truck muatan sebelum membangun.',
      'Beri dinding penahan tanah (talud) jika beda tinggi dengan pekarangan sebelah melebihi 50 cm.',
    ],
    civilTip: 'Tanah padas merah memadat kuat dan tidak berubah menjadi lumpur bubur saat diguyur hujan deras Nabire.',
    recommendedMaterial: 'Tanah Timbunan & Pemerataan Lahan CV KAMINDIPMAN',
  },
];

interface ProjectTipsSectionProps {
  onOpenEstimator: () => void;
  onGoToOrder: () => void;
}

export const ProjectTipsSection: React.FC<ProjectTipsSectionProps> = ({
  onOpenEstimator,
  onGoToOrder,
}) => {
  const [activeTab, setActiveTab] = useState<string>(PROJECT_TIPS[0].id);

  const selectedTip = PROJECT_TIPS.find((t) => t.id === activeTab) || PROJECT_TIPS[0];

  return (
    <section className="py-16 bg-white border-t border-zinc-200" id="tips-konstruksi">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Edukasi & Pedoman Teknis Konstruksi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
            Panduan Menghitung Material & Tips Bangunan Nabire
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            Kumpulan panduan praktis dari mandor dan praktisi sipil CV KAMINDIPMAN agar proyek hunian, gedung kantor, maupun jalan Anda memiliki mutu kokoh, efisien biaya, dan hemat ritasi dump truck.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-8">
          {PROJECT_TIPS.map((tip) => (
            <button
              key={tip.id}
              onClick={() => setActiveTab(tip.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                activeTab === tip.id
                  ? 'bg-zinc-900 border-zinc-900 text-white shadow-md'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1">
                {tip.category}
              </div>
              <div className="font-extrabold text-xs sm:text-sm line-clamp-2 leading-snug">
                {tip.title}
              </div>
            </button>
          ))}
        </div>

        {/* Active Tip Deep Dive Card */}
        <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-md bg-orange-600 text-white font-black text-[11px] uppercase tracking-wider mb-2">
                  {selectedTip.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight leading-tight">
                  {selectedTip.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
                  {selectedTip.summary}
                </p>
              </div>

              {/* Step by step checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Langkah & Kaidah Teknis Terbaik:</span>
                </h4>
                <div className="space-y-2.5">
                  {selectedTip.keySteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3.5 rounded-xl border border-zinc-200 flex items-start gap-3 text-xs leading-relaxed text-zinc-700 shadow-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Callout & Action Column (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Civil Engineer Tip Box */}
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Catatan Khusus Lapangan</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                  "{selectedTip.civilTip}"
                </p>
              </div>

              {/* Recommended Product Box */}
              <div className="bg-zinc-900 text-white rounded-2xl p-5 border border-zinc-800 space-y-4">
                <div>
                  <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                    Material Rekomendasi Quarry:
                  </div>
                  <div className="text-sm font-extrabold text-white mt-1">
                    {selectedTip.recommendedMaterial}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Ditambang langsung di Kampung Wangar Makmur, Nabire Barat.
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={onOpenEstimator}
                    className="flex-1 py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl border border-zinc-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5 text-orange-400" />
                    <span>Hitung Kebutuhan (P x L)</span>
                  </button>

                  <button
                    onClick={onGoToOrder}
                    className="flex-1 py-2.5 px-3 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
                  >
                    <span>Pesan Material</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
