import React, { useState } from 'react';
import { TestimonialItem } from '../types';
import { ChevronLeft, ChevronRight, Quote, PenTool, Check, Loader2, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../lib/api';

interface TestimonialsProps {
  testimonials: TestimonialItem[];
  onRefresh?: () => void;
}

export default function Testimonials({ testimonials, onRefresh }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [clientName, setClientName] = useState('');
  const [clientRole, setClientRole] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !feedback.trim()) {
      setFormError('Please enter both your Name and your Review feedback.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      await api.submitTestimonial({
        clientName: clientName.trim(),
        clientRole: clientRole.trim() || 'Client',
        clientCompany: clientCompany.trim() || 'Independent',
        feedback: feedback.trim(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(clientName.trim())}`
      });

      setSubmitSuccess(true);
      
      // Reset form
      setClientName('');
      setClientRole('');
      setClientCompany('');
      setFeedback('');

      // Refresh parent app state
      if (onRefresh) {
        onRefresh();
      }

      // Hide success banner and close form after a few seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowForm(false);
      }, 3500);

    } catch (err: any) {
      console.error('Review submission error:', err);
      setFormError(err.message || 'Unable to publish review at this moment.');
    } finally {
      setSubmitting(false);
    }
  };

  const current = testimonials[activeIndex];

  return (
    <section id="testimonials" className="py-24 bg-[#0A0A0A] border-b border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-10 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-blue-950/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10 text-center">
        <span className="text-xs font-bold font-mono text-blue-500 tracking-widest uppercase mb-4 inline-block">
          TESTIMONIALS
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-4">
          Loved by Creative Leaders
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto mb-16">
          Real client evaluations of Aura Pixel's custom bespoke products, high-end design workflows, and pixel-perfect technical delivery.
        </p>

        {/* Testimonials Display Section */}
        {testimonials.length === 0 ? (
          <div className="relative max-w-4xl mx-auto bg-zinc-900/60 border border-white/5 rounded-3xl p-8 sm:p-12 shadow-xl mb-12 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center py-6">
              <Quote className="w-12 h-12 text-slate-700 mb-4 animate-pulse" />
              <p className="text-slate-400 font-display font-medium text-sm mb-2">
                No Customer Reviews Published Yet
              </p>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                Be the first to share your experience working with our high-precision design and engineering studio!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-all duration-300"
              >
                <PenTool className="w-4 h-4" />
                <span>Write the First Review</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative min-h-[350px] sm:min-h-[280px] flex flex-col justify-center max-w-4xl mx-auto bg-zinc-900 border border-white/5 rounded-3xl p-8 sm:p-12 shadow-sm mb-12">
            
            {/* Floating watermark quote icon */}
            <div className="absolute top-6 left-6 text-white/5 pointer-events-none">
              <Quote className="w-16 h-16 transform -rotate-12" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current ? current.id : 'empty'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative flex flex-col items-center"
              >
                {current && (
                  <>
                    {/* Feedback Content */}
                    <p className="text-base sm:text-lg text-slate-300 italic leading-relaxed text-center mb-8 max-w-2xl relative z-10">
                      &ldquo;{current.feedback}&rdquo;
                    </p>

                    {/* Client Profile details */}
                    <div className="flex items-center gap-4 text-left">
                      <img
                        src={current.avatar}
                        alt={current.clientName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-sm bg-zinc-800"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div>
                        <h4 className="font-display font-bold text-white text-sm leading-tight">
                          {current.clientName}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">
                          {current.clientRole} at <span className="text-blue-400 font-semibold">{current.clientCompany}</span>
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            {testimonials.length > 1 && (
              <div className="absolute bottom-6 sm:bottom-auto sm:-right-6 sm:top-1/2 sm:-translate-y-1/2 flex sm:flex-col gap-3 justify-center w-full sm:w-auto left-0 sm:left-auto z-20">
                <button
                  onClick={handlePrev}
                  className="p-3 bg-zinc-900 border border-white/10 hover:border-blue-500 hover:text-blue-400 text-slate-400 rounded-full shadow-md transition-all duration-200 cursor-pointer"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-3 bg-zinc-900 border border-white/10 hover:border-blue-500 hover:text-blue-400 text-slate-400 rounded-full shadow-md transition-all duration-200 cursor-pointer"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action Button to Open Submission Form */}
        {testimonials.length > 0 && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-600 text-slate-300 hover:text-white font-semibold rounded-xl text-xs tracking-wide transition-all duration-300 cursor-pointer"
            >
              <PenTool className="w-4 h-4" />
              <span>Write a Client Review</span>
            </button>
          </motion.div>
        )}

        {/* Interactive Testimonial Form Drawer/Accordion */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: 20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="max-w-xl mx-auto bg-zinc-900/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative mt-6 text-left"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
                aria-label="Close review form"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-6">
                <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                <h3 className="font-display font-bold text-lg text-white">
                  Add Your Professional Evaluation
                </h3>
              </div>

              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-3"
                >
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
                    <Check className="w-6 h-6 animate-bounce" />
                  </div>
                  <h4 className="font-display font-bold text-white text-sm">Review Submitted Successfully</h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Thank you! Your feedback has been cryptographically recorded and published instantly onto our live review stream.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="clientName" className="block text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase mb-1.5">
                        Your Full Name <span className="text-blue-500">*</span>
                      </label>
                      <input
                        id="clientName"
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Marcello Rossi"
                        className="w-full bg-zinc-950 border border-white/5 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="clientRole" className="block text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase mb-1.5">
                        Professional Title
                      </label>
                      <input
                        id="clientRole"
                        type="text"
                        value={clientRole}
                        onChange={(e) => setClientRole(e.target.value)}
                        placeholder="e.g. Creative Director"
                        className="w-full bg-zinc-950 border border-white/5 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="clientCompany" className="block text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase mb-1.5">
                      Company Name
                    </label>
                    <input
                      id="clientCompany"
                      type="text"
                      value={clientCompany}
                      onChange={(e) => setClientCompany(e.target.value)}
                      placeholder="e.g. Veloce Automotive"
                      className="w-full bg-zinc-950 border border-white/5 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="feedback" className="block text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase mb-1.5">
                      Your Feedback / Review <span className="text-blue-500">*</span>
                    </label>
                    <textarea
                      id="feedback"
                      required
                      rows={4}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Share your detailed feedback regarding our bespoke technical layouts, design precision, and delivery speed..."
                      className="w-full bg-zinc-950 border border-white/5 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 outline-none transition-all resize-none leading-relaxed"
                    />
                  </div>

                  {formError && (
                    <p className="text-xs font-semibold text-rose-500 tracking-wide">
                      {formError}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <span>Publish Review</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
