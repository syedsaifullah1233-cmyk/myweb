import { ArrowRight, Globe } from 'lucide-react';
import { HeroContent } from '../types';
import { motion } from 'motion/react';

interface HeroProps {
  content: HeroContent;
}

export default function Hero({ content }: HeroProps) {
  // Gracefully fallback to imported image if configured, or use the database content
  const heroImgSrc = content.heroImage;

  return (
    <section
      id="home"
      className="relative pt-32 pb-20 lg:pt-48 lg:pb-36 bg-[#0A0A0A] overflow-hidden"
    >
      {/* Background Decorative Polygons */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-blue-950/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Hero Left: Strategic Copy and CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Soft, professional badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
            >
              <Globe className="w-4 h-4 text-blue-400 animate-spin-slow" />
              <span className="text-xs font-semibold text-blue-300 tracking-wide font-mono uppercase">
                Bespoke Digital Craftsmanship
              </span>
            </motion.div>

            {/* Headline with high-contrast text wrapping */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.1] tracking-tight mb-6"
            >
              {content.title}
            </motion.h1>

            {/* Subtext description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-400 leading-relaxed max-w-xl mb-10"
            >
              {content.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            >
              <a
                href={content.ctaLink || '#contact'}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/15 hover:shadow-blue-600/25 transition-all duration-200 active:scale-[0.98]"
              >
                {content.ctaText}
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href={content.secondaryCtaLink || '#portfolio'}
                className="inline-flex items-center justify-center px-7 py-4 bg-white/5 hover:bg-white/10 text-slate-100 font-semibold rounded-xl border border-white/10 hover:border-white/20 shadow-sm transition-all duration-200 active:scale-[0.98]"
              >
                {content.secondaryCtaText}
              </a>
            </motion.div>
          </div>

          {/* Hero Right: High-impact brand image artwork */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Elegant glowing background layer */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 to-cyan-600 rounded-3xl opacity-20 blur-2xl -z-10" />

            <div className="bg-zinc-900 p-3 rounded-3xl border border-white/5 shadow-2xl overflow-hidden aspect-[4/3] lg:aspect-auto">
              <img
                src={heroImgSrc}
                alt="Aura Pixel Design Representation"
                className="w-full h-full object-cover rounded-2xl shadow-inner transition-transform duration-700 hover:scale-[1.02]"
                referrerPolicy="no-referrer"
                loading="eager"
              />
            </div>

            {/* Micro Floating Tech Accents (No tech larping, just elegant spatial badges) */}
            <div className="absolute -bottom-6 -left-6 bg-zinc-900 border border-white/10 shadow-xl p-4 rounded-2xl hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <span className="font-display font-bold text-blue-400 text-lg">AP</span>
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">ESTABLISHED</p>
                <p className="text-sm font-bold text-slate-200">2026 Studio</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
