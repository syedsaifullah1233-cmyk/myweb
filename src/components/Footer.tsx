import { ArrowUp, Instagram, Facebook, Mail } from 'lucide-react';
import { SocialLinks } from '../types';

interface FooterProps {
  socialLinks: SocialLinks;
}

export default function Footer({ socialLinks }: FooterProps) {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-[#0A0A0A] text-slate-400 py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          
          {/* Footer Left: Brand & Copy */}
          <div className="md:col-span-5 flex flex-col items-start text-left">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo_icon.svg"
                alt="Aura Pixel Standalone Logo"
                className="w-8 h-8 filter brightness-0 invert"
                referrerPolicy="no-referrer"
              />
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Aura<span className="text-blue-500 font-normal">Pixel</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
              A bespoke digital craftsmanship brand. We hand-code high-performance, visually supreme, and SEO-optimized web experiences designed to position your brand as an undisputed industry authority.
            </p>
            <p className="text-xs font-mono text-slate-500">
              San Francisco &bull; London &bull; Tokyo
            </p>
          </div>

          {/* Footer Middle: Quick Links */}
          <div className="md:col-span-4 flex flex-col items-start text-left md:pl-12">
            <h4 className="text-white text-xs font-bold font-mono tracking-widest uppercase mb-6">
              STUDIO INDEX
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <a href="#home" className="hover:text-white transition-colors">Home</a>
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
              <a href="#live-projects" className="hover:text-white transition-colors">Live Projects</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>

          {/* Footer Right: Social Networks & Email */}
          <div className="md:col-span-3 flex flex-col items-start text-left">
            <h4 className="text-white text-xs font-bold font-mono tracking-widest uppercase mb-6">
              CONNECT WITH US
            </h4>
            
            {/* Social channels flex block */}
            <div className="flex items-center gap-4 mb-6">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-zinc-900 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl transition-all duration-300"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-zinc-900 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl transition-all duration-300"
                aria-label="Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${socialLinks.email}`}
                className="p-3 bg-zinc-900 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl transition-all duration-300"
                aria-label="Email Inbox"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Have an urgent brief? Reach out to us directly at <a href={`mailto:${socialLinks.email}`} className="text-blue-400 font-semibold hover:underline">{socialLinks.email}</a>
            </p>
          </div>

        </div>

        {/* Divider and back to top action row */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} Aura Pixel Digital Labs. All rights reserved. Hand-coded in California.
          </p>

          <button
            onClick={handleScrollToTop}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-zinc-900 border border-white/5 hover:bg-zinc-800 px-4 py-2.5 rounded-full transition-all duration-200 shadow-sm cursor-pointer"
            aria-label="Back to top"
          >
            <span>Back To Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
