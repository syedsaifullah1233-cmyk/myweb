import { useState } from 'react';
import { FaqItem } from '../types';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FaqProps {
  faq: FaqItem[];
}

export default function Faq({ faq }: FaqProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10 text-left">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold font-mono text-blue-500 tracking-widest uppercase mb-4 inline-block">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faq.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:border-white/10"
              >
                {/* Question Trigger */}
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center justify-between p-6 text-left font-display font-semibold text-slate-200 hover:text-blue-400 transition-colors focus:outline-none"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <HelpCircle className="w-5 h-5 text-blue-400 shrink-0" />
                    <span className="text-sm sm:text-base leading-snug">{item.question}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'transform rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>

                {/* Animated Dropdown Answer Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/5">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
