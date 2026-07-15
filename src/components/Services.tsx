import * as LucideIcons from 'lucide-react';
import { ServiceItem } from '../types';
import { motion } from 'motion/react';

interface ServicesProps {
  services: ServiceItem[];
}

// Highly robust dynamic icon resolver mapping any valid Lucide identifier to its component
export function ServiceIcon({ name, ...props }: { name: string; className?: string }) {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) {
    // Elegant fallback icon
    return <LucideIcons.Layers {...props} />;
  }
  return <IconComponent {...props} />;
}

export default function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-bold font-mono text-blue-500 tracking-widest uppercase mb-4 inline-block">
            OUR CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-6">
            Bespoke Web Development Categories
          </h2>
          <p className="text-slate-400">
            We do not compromise. We design and handcode every layout to fit specific brand requirements, optimizing performance, accessibility, and luxury feel.
          </p>
        </div>

        {/* Services Grid (Highly responsive 3-column grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-zinc-900 border border-white/5 p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:border-blue-500/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-start text-left group"
            >
              {/* Dynamic Icon with hover accentuation */}
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                <ServiceIcon name={service.iconName} className="w-6 h-6" />
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-display font-bold text-white mb-3 tracking-tight group-hover:text-blue-400 transition-colors duration-200">
                {service.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Features List */}
              <div className="mt-auto w-full pt-4 border-t border-white/5">
                <ul className="space-y-2.5">
                  {service.features?.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2.5 text-xs font-medium text-slate-300">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
