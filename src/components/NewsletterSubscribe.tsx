import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowRight, Bell } from 'lucide-react';
import { storageService } from '../services/storageService';

export const NewsletterSubscribe: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    const res = storageService.subscribeNewsletter(email);
    setIsLoading(false);

    if (res.success) {
      setStatus('success');
      setMessage(res.message);
      setEmail('');
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 6000);
    } else {
      setStatus('error');
      setMessage(res.message);
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }
  };

  return (
    <div className="bg-zinc-900/90 rounded-2xl p-6 sm:p-7 border border-zinc-800 text-white shadow-lg space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
          <Bell className="w-5 h-5 text-orange-500 animate-pulse" />
        </div>
        <div>
          <h4 className="text-base font-extrabold text-white tracking-tight">
            Berlangganan Info Material & Promo Nabire
          </h4>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Dapatkan pembaruan stok tambang Wangar Makmur, subsidi ritase berkala, serta panduan teknis konstruksi langsung ke email Anda.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan alamat email Anda..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
          >
            <span>{isLoading ? 'Mendaftarkan...' : 'Langganan'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {status === 'success' && (
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 pt-1 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="text-xs font-semibold text-red-400 flex items-center gap-1.5 pt-1 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}
      </form>
    </div>
  );
};
