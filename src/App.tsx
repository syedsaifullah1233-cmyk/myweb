import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import LiveProjects from './components/LiveProjects';
import Testimonials from './components/Testimonials';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { api } from './lib/api';
import { Project, WebsiteContent } from './types';
import { Loader2, Sparkles, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Modal visibility states
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  
  // App-wide loading & error statuses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load essential database assets on application mount
  const loadData = async () => {
    try {
      setError(null);
      const [fetchedProjects, fetchedContent, authenticated] = await Promise.all([
        api.getProjects(),
        api.getContent(),
        api.verifyStatus()
      ]);
      
      setProjects(fetchedProjects);
      setContent(fetchedContent);
      setIsAdmin(authenticated);
    } catch (err: any) {
      console.error('Boot loading error:', err);
      setError('Connection to the Aura Pixel secure database failed. Please verify the backend service is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
      setIsAdmin(false);
      setShowDashboard(false);
      loadData();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Preloader Screen
  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center text-center z-50">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 animate-pulse" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full relative z-10"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="font-display font-bold text-xl text-white tracking-wide">
            Aura<span className="text-blue-500 font-normal">Pixel</span>
          </h1>
          <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
            Loading Bespoke Web Experience
          </p>
        </motion.div>
      </div>
    );
  }

  // Database Connection Error Fallback
  if (error || !content) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-zinc-900 border border-white/5 p-8 rounded-3xl shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="font-display font-bold text-xl text-white mb-2">Systems Connection Interrupted</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {error || 'Unable to load necessary visual assets and structural data schemas.'}
          </p>
          <button
            onClick={() => {
              setLoading(true);
              loadData();
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Retry Database Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200 selection:bg-blue-600 selection:text-white">
      {/* Floating Sparkles accent representing high craftsmanship */}
      <div className="fixed top-6 left-6 z-40 hidden lg:flex items-center gap-2 pointer-events-none">
        <Sparkles className="w-4 h-4 text-blue-500/60 animate-pulse" />
        <span className="text-[9px] font-bold font-mono tracking-widest text-slate-500 uppercase opacity-60">
          Craftsman Layer Active
        </span>
      </div>

      {/* Primary Sticky Frosted Glass Navigation Header */}
      <Navbar
        onOpenLogin={() => setShowLogin(true)}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onOpenDashboard={() => setShowDashboard(true)}
      />

      {/* Website Sections */}
      <main>
        {/* Hero Banner Section */}
        <Hero content={content.hero} />

        {/* Story details, Metrics, and Pillars */}
        <About content={content.about} />

        {/* 9 customizable service cards */}
        <Services services={content.services} />

        {/* Dynamic Portfolio Case Studies with popup overlays */}
        <Portfolio projects={projects} />

        {/* Dedicated Live Projects showcase */}
        <LiveProjects projects={projects} />

        {/* High-contrast feedback sliders */}
        <Testimonials testimonials={content.testimonials} onRefresh={loadData} />

        {/* FAQ Accordions with spring heights */}
        <Faq faq={content.faq} />

        {/* Secure proposal contact sheet */}
        <Contact contactInfo={content.contact} socialLinks={content.social} />
      </main>

      {/* Brand Footer */}
      <Footer socialLinks={content.social} />

      {/* SECURE ADMIN LOGIN MODAL OVERLAY */}
      <AnimatePresence>
        {showLogin && (
          <AdminLogin
            onClose={() => setShowLogin(false)}
            onLoginSuccess={() => {
              setIsAdmin(true);
              setShowDashboard(true);
              loadData();
            }}
          />
        )}
      </AnimatePresence>

      {/* SECURE CONTROL CENTER DASHBOARD OVERLAY */}
      <AnimatePresence>
        {showDashboard && (
          <AdminDashboard
            projects={projects}
            content={content}
            onClose={() => setShowDashboard(false)}
            onRefreshData={loadData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
