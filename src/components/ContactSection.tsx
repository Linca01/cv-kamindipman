import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, ExternalLink } from 'lucide-react';
import { CompanySettings } from '../types';
import { generateWhatsAppDirectUrl } from '../utils/orderCalculator';

interface ContactSectionProps {
  settings: CompanySettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [subject, setSubject] = React.useState('Tanya Ketersediaan Material');
  const [message, setMessage] = React.useState('');
  const [sentSuccess, setSentSuccess] = React.useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const fullMsg = [
      `Halo Admin CV KAMINDIPMAN,`,
      `Nama: ${name}`,
      `Nomor Kontak: ${phone}`,
      `Perihal: ${subject}`,
      `Pesan: ${message}`,
    ].join('\n');

    const url = generateWhatsAppDirectUrl(settings.adminWhatsApp, fullMsg);
    window.open(url, '_blank', 'noopener,noreferrer');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  const quarryMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Kampung Wangar Makmur, Nabire Barat, Nabire, Papua Tengah')}`;

  return (
    <section className="py-16 bg-zinc-100 text-zinc-900" id="kontak">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Phone className="w-3.5 h-3.5" />
            <span>Pusat Informasi & Layanan Pelanggan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
            Hubungi CV KAMINDIPMAN
          </h2>
          <p className="text-sm text-zinc-600 mt-2">
            Kami siap melayani kebutuhan material proyek Anda di seluruh wilayah Nabire dan Papua Tengah.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Address & Quarry Location */}
            <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-sm text-zinc-900 mb-1">
                  Alamat Quarry & Pengambilan Material:
                </h4>
                <p className="text-zinc-600 leading-relaxed">
                  {settings.quarryLocation}
                </p>
                <a
                  href={quarryMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-orange-600 font-bold hover:text-orange-700 mt-2"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* WhatsApp Contact */}
            <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-sm text-zinc-900 mb-1">
                  WhatsApp & Telepon Resmi:
                </h4>
                <p className="text-zinc-600 font-mono text-sm font-bold">
                  +{settings.adminWhatsApp}
                </p>
                <p className="text-zinc-500 mt-0.5">
                  Alternatif Telepon Mandor: {settings.alternatePhone}
                </p>
                <div className="mt-2">
                  <a
                    href={`https://wa.me/${settings.adminWhatsApp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat WhatsApp Sekarang</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Operational Hours */}
            <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-sm text-zinc-900 mb-1">
                  Jam Operasional Tambang & Pengiriman:
                </h4>
                <p className="text-zinc-600 leading-relaxed">
                  {settings.operationalHours}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Pemesanan website & WhatsApp tetap aktif 24 jam untuk pencatatan antrian rit berikutnya.
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-sm text-zinc-900 mb-1">
                  Email Korespondensi & Surat Penawaran:
                </h4>
                <p className="text-zinc-600 font-mono">
                  {settings.email}
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Map Preview & Fast Message Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Visual Location Map Box */}
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-zinc-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="font-bold text-xs uppercase tracking-wider">
                    Peta Lokasi Quarry CV KAMINDIPMAN
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400">
                  Kampung Wangar Makmur, Nabire Barat
                </span>
              </div>

              {/* Styled Vector Map Rendering */}
              <div className="relative h-64 sm:h-72 bg-zinc-900 flex flex-col justify-between p-6 overflow-hidden">
                {/* Visual Map Grid & River Elements */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Stylized River and Road vector lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 0 120 Q 200 80 400 160 T 800 100" fill="none" stroke="#38bdf8" strokeWidth="6" />
                  <path d="M 100 0 Q 220 180 320 300" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="6,4" />
                </svg>

                <div className="relative z-10 flex justify-between items-start">
                  <div className="bg-zinc-950/90 text-white p-3 rounded-lg border border-zinc-800 text-xs backdrop-blur-sm max-w-xs">
                    <div className="font-bold text-orange-400">Titik Tambang Galian C:</div>
                    <p className="text-[11px] text-zinc-300 mt-0.5">
                      Depo & Stockpile CV KAMINDIPMAN, Wangar Makmur, Nabire Barat.
                    </p>
                  </div>

                  <a
                    href={quarryMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5 transition-colors"
                  >
                    <span>Petunjuk Arah</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Pin Center Marker */}
                <div className="relative z-10 self-center text-center animate-bounce">
                  <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl ring-4 ring-orange-500/30">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="bg-zinc-950 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                    CV KAMINDIPMAN QUARRY
                  </div>
                </div>

                <div className="relative z-10 bg-zinc-950/80 px-3 py-1.5 rounded text-[11px] text-zinc-400 flex justify-between items-center">
                  <span>Kabupaten Nabire, Papua Tengah</span>
                  <span className="font-mono text-zinc-500">Koordinat Aluvial Wangar Makmur</span>
                </div>
              </div>
            </div>

            {/* Fast WhatsApp Direct Form */}
            <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-zinc-900">
                Kirim Pertanyaan Langsung ke WhatsApp Admin
              </h3>

              <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">Nama Lengkap:</label>
                    <input
                      type="text"
                      placeholder="Nama Anda..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">Nomor Kontak / WA:</label>
                    <input
                      type="tel"
                      placeholder="0812..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Pilihan Topik:</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Tanya Ketersediaan & Harga Pasir">Tanya Ketersediaan & Harga Pasir</option>
                    <option value="Tanya Harga Batu Fondasi & Split">Tanya Harga Batu Fondasi & Split</option>
                    <option value="Tanya Material Sirtu Pengerasan Jalan">Tanya Material Sirtu Pengerasan Jalan</option>
                    <option value="Pemesanan Volume Besar Tanah Timbunan">Pemesanan Volume Besar Tanah Timbunan</option>
                    <option value="Negosiasi Kontrak & Armada Dump Truck">Negosiasi Kontrak & Armada Dump Truck</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Pesan / Lokasi Proyek Anda:</label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan kebutuhan rit dan detail lokasi proyek Anda di Nabire..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesan ke WhatsApp Perusahaan</span>
                </button>

                {sentSuccess && (
                  <p className="text-xs text-emerald-600 font-bold text-center">
                    Pesan telah disiapkan di WhatsApp Anda!
                  </p>
                )}
              </form>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
