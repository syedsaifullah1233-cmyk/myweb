import { Shield, Sparkles, HeartHandshake, Eye, Award, CheckCircle } from 'lucide-react';
import { AboutContent } from '../types';
import { motion } from 'motion/react';

interface AboutProps {
  content: AboutContent;
}

export default function About({ content }: AboutProps) {
  // Brand value highlights requested by user
  const brandPillars = [
    {
      icon: Award,
      title: 'Absolute Quality',
      description: 'We do not compromise. Every structural line, spacing, and element is tuned for visual supremacy.'
    },
    {
      icon: Sparkles,
      title: 'Bespoke Creativity',
      description: 'Zero templates. We build custom-crafted layouts designed to elevate your distinct brand.'
    },
    {
      icon: HeartHandshake,
      title: 'Client Satisfaction',
      description: 'We partner closely with you from first wireframe to public domain, ensuring perfect alignment.'
    },
    {
      icon: Eye,
      title: 'Modern UI/UX',
      description: 'We balance negative space, clean typography, and motion to command user attention immediately.'
    },
    {
      icon: Shield,
      title: 'Reliable Service',
      description: 'Our hand-coded systems have zero bloat, meaning perfect security, high uptime, and bulletproof builds.'
    },
    {
      icon: CheckCircle,
      title: 'Professional Communication',
      description: 'No jargon. Direct access to your developers, scheduled timelines, and clear weekly progress logs.'
    }
  ];

  return (
    <section id="about" className="py-24 bg-[#0A0A0A] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* About Left: Main Copy & Dynamic Metrics */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <span className="text-xs font-bold font-mono text-blue-500 tracking-widest uppercase mb-4">
              ABOUT OUR STUDIO
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-tight mb-6">
              {content.headline}
            </h2>
            <div className="w-12 h-1 bg-blue-600 rounded-full mb-8" />
            <p className="text-slate-400 text-base leading-relaxed mb-10">
              {content.story}
            </p>

            {/* Grid layout for metrics */}
            <div className="grid grid-cols-2 gap-6 w-full">
              {content.metrics?.map((metric, idx) => (
                <div key={idx} className="p-5 bg-zinc-900 border border-white/5 rounded-2xl text-left hover:border-white/10 transition-all duration-200">
                  <p className="text-3xl sm:text-4xl font-display font-bold text-blue-400 mb-1">
                    {metric.value}
                  </p>
                  <p className="text-sm font-semibold text-slate-400">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* About Right: Core Pillars (The "Why Choose Aura Pixel" element requested) */}
          <div className="lg:col-span-6">
            <div className="bg-zinc-900/40 border border-white/5 p-8 sm:p-10 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-900/10 rounded-full blur-2xl pointer-events-none" />
              
              <h3 className="text-xl font-display font-bold text-white mb-8 text-left">
                Why Brands Partner With Us
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
                {brandPillars.map((pillar, index) => {
                  const IconComponent = pillar.icon;
                  return (
                    <div key={index} className="flex flex-col items-start gap-3">
                      <div className="w-10 h-10 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-center shadow-sm text-blue-400">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h4 className="font-semibold text-slate-200 text-sm">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
