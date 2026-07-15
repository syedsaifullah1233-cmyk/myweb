import { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import { ContactInfo, SocialLinks } from '../types';

interface ContactProps {
  contactInfo: ContactInfo;
  socialLinks: SocialLinks;
}

export default function Contact({ contactInfo, socialLinks }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Business Website',
    budget: '$1,000 - $3,000',
    description: '',
    message: ''
  });

  // Honeypot spam prevention field
  const [honeypot, setHoneypot] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const projectOptions = [
    'Business Website',
    'Portfolio Website',
    'Landing Page',
    'Restaurant Website',
    'Wedding Website',
    'School Website',
    'Personal Website',
    'Agency Website',
    'Custom Website Platform'
  ];

  const budgetOptions = [
    'Under $1,000',
    '$1,000 - $3,000',
    '$3,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000+'
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Spam check trigger (honeypot)
    if (honeypot.trim() !== '') {
      console.warn('Spam submission detected via honeypot.');
      setStatus({
        success: true,
        message: 'Your query has been recorded. Thank you!'
      });
      return;
    }

    // Client-side validations
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({
        success: false,
        message: 'Please complete all required fields (Full Name, Email, and Message).'
      });
      return;
    }

    // Check email pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatus({
        success: false,
        message: 'Please enter a valid email address.'
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await api.submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        projectType: formData.projectType,
        budget: formData.budget,
        description: formData.description.trim() || `Inquiry for ${formData.projectType}`,
        message: formData.message.trim()
      });

      if (response.success) {
        setStatus({
          success: true,
          message: response.message
        });
        // Clear Form on success
        setFormData({
          name: '',
          email: '',
          phone: '',
          projectType: 'Business Website',
          budget: '$1,000 - $3,000',
          description: '',
          message: ''
        });
      }
    } catch (err: any) {
      setStatus({
        success: false,
        message: err.message || 'Transmission failed. Our servers appear temporarily offline. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0A0A0A] relative">
      <div className="absolute top-0 right-10 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Grid Layout splits Left info & Right form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Contact Left: General Info and details */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <span className="text-xs font-bold font-mono text-blue-500 tracking-widest uppercase mb-4 inline-block">
              GET IN TOUCH
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-none mb-6">
              Let&apos;s build something beautiful.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-10 max-w-sm">
              Ready to elevate your digital presence? Send us your project parameters and our engineering directors will contact you directly to schedule a wireframe review.
            </p>

            {/* Technical contact cards */}
            <div className="space-y-6 w-full">
              <div className="flex items-start gap-4 p-5 bg-zinc-900 border border-white/5 rounded-2xl">
                <div className="w-10 h-10 bg-zinc-950 border border-white/10 text-blue-400 flex items-center justify-center rounded-xl shadow-sm shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-0.5">DIRECT ENVELOP</p>
                  <a href={`mailto:${contactInfo.email}`} className="text-sm font-semibold text-slate-200 hover:text-blue-400 transition-colors">
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-zinc-900 border border-white/5 rounded-2xl">
                <div className="w-10 h-10 bg-zinc-950 border border-white/10 text-blue-400 flex items-center justify-center rounded-xl shadow-sm shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-0.5">DIRECT DIAL</p>
                  <a href={`tel:${contactInfo.phone}`} className="text-sm font-semibold text-slate-200 hover:text-blue-400 transition-colors">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-zinc-900 border border-white/5 rounded-2xl">
                <div className="w-10 h-10 bg-zinc-950 border border-white/10 text-blue-400 flex items-center justify-center rounded-xl shadow-sm shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-0.5">STUDIO LABS</p>
                  <p className="text-sm font-semibold text-slate-200">
                    {contactInfo.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Right: Fully Loaded Client Proposal Form */}
          <div className="lg:col-span-7 bg-zinc-900 border border-white/5 p-8 sm:p-10 rounded-3xl shadow-sm">
            
            <h3 className="text-lg font-display font-bold text-white mb-2 text-left flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-blue-400" />
              Project Proposal Form
            </h3>
            <p className="text-xs text-slate-500 text-left mb-8">All details are encrypted and transmitted directly to our inbox.</p>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              
              {/* HONEYPOT (Spam protector hidden visually) */}
              <input
                type="text"
                name="user_token_auth_trap"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="form-name" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Full Name <span className="text-blue-400">*</span>
                  </label>
                  <input
                    id="form-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Sarah Chen"
                    className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all text-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="form-email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Email Address <span className="text-blue-400">*</span>
                  </label>
                  <input
                    id="form-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah@example.com"
                    className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all text-slate-200 font-medium"
                  />
                </div>
              </div>

              {/* Row 2: Phone & Project Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="form-phone" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    id="form-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all text-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="form-project-type" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Project Type
                  </label>
                  <select
                    id="form-project-type"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all text-slate-300 font-medium cursor-pointer"
                  >
                    {projectOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-zinc-900 text-slate-200">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Budget Slider/Selector */}
              <div>
                <label htmlFor="form-budget" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Estimated Budget
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {budgetOptions.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormData({ ...formData, budget: b })}
                      className={`py-2 px-1 text-[11px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                        formData.budget === b
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-zinc-950 text-slate-300 border border-white/10 hover:border-white/20 hover:bg-zinc-900'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 4: Project Summary description (for custom builds if needed) */}
              <div>
                <label htmlFor="form-description" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Project Title / Summary
                </label>
                <input
                  id="form-description"
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Elysian Fine Dining Menu & Booking Overhaul"
                  className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all text-slate-200 font-medium"
                />
              </div>

              {/* Row 5: Detailed Message body */}
              <div>
                <label htmlFor="form-message" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Project Message <span className="text-blue-400">*</span>
                </label>
                <textarea
                  id="form-message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide an overview of your creative scope, desired timelines, and key competitors..."
                  className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all text-slate-200 font-medium resize-none"
                />
              </div>

              {/* Action response banner */}
              {status && (
                <div
                  className={`p-4 rounded-xl flex items-start gap-3 border ${
                    status.success
                      ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400'
                      : 'bg-rose-950/20 border-rose-500/20 text-rose-400'
                  }`}
                >
                  {status.success ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <p className="text-xs font-medium leading-relaxed text-left">{status.message}</p>
                </div>
              )}

              {/* Submission Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting Proposal...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Transmit Query Details</span>
                  </>
                )}
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
