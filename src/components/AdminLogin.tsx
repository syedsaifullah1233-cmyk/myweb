import { useState, FormEvent } from 'react';
import { X, Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLoginProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onClose, onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both administrator email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.login(email.trim(), password);
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authorization failed. Incorrect credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Dynamic Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden max-w-md w-full shadow-2xl p-8 relative text-left"
      >
        {/* Absolute floating close action */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-full transition-colors cursor-pointer"
          aria-label="Close login"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Banner Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-zinc-950 border border-white/10 rounded-2xl flex items-center justify-center text-blue-400 mx-auto mb-4 shadow-sm">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-xl text-white tracking-tight">
            Administrator Gateway
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Authorize credentials to access the Aura Pixel suite controls.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email block */}
          <div>
            <label htmlFor="login-email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Secure Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="administrator@aurapixel.tech"
                className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all text-slate-200 font-medium"
              />
            </div>
          </div>

          {/* Password block */}
          <div>
            <label htmlFor="login-password" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Secure Credentials Code
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-11 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all text-slate-200 font-medium"
              />
              {/* Toggle reveal */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Alerts */}
          {error && (
            <div className="p-3.5 bg-rose-950/20 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-medium leading-relaxed flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0 mt-1.5 animate-pulse" />
              <p className="flex-grow">{error}</p>
            </div>
          )}

          {/* Submission button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/10 transition-colors disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating Node...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Authorize Access</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-500 text-center leading-relaxed mt-4">
            Security audit logs are generated automatically on submission.
          </p>

        </form>
      </motion.div>
    </div>
  );
}
