import { useState } from 'react';
import { Project } from '../types';
import { ExternalLink, X, ArrowUpRight, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PortfolioProps {
  projects: Project[];
}

export default function Portfolio({ projects }: PortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Generate unique categories dynamically based on loaded database projects
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  // Filter projects (also hiding hidden projects in general view)
  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    return matchesCategory && !project.hidden;
  });

  return (
    <section id="portfolio" className="py-24 bg-[#0A0A0A] relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="text-left max-w-xl">
            <span className="text-xs font-bold font-mono text-blue-500 tracking-widest uppercase mb-4 inline-block">
              CASE STUDIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-none">
              Handcrafted Portfolio Showcase
            </h2>
          </div>

          {/* Categories Horizontal Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Case Studies Grid (Using standard grid for optimal, reliable loading) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                key={project.id}
                onClick={() => setActiveProject(project)}
                className="group cursor-pointer bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-500/20 transition-all duration-300 flex flex-col h-full"
              >
                {/* Thumbnail Layer with Hover Zoom */}
                <div className="aspect-[4/3] overflow-hidden bg-zinc-950 relative">
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                    <span className="p-3 bg-[#0A0A0A] text-white rounded-full shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 border border-white/10">
                      <ArrowUpRight className="w-5 h-5" />
                    </span>
                  </div>
                  <img
                    src={project.thumbnail || project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {/* Category Pill Tag */}
                  <span className="absolute top-4 left-4 z-20 bg-zinc-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-blue-400 font-mono tracking-wider uppercase border border-white/5">
                    {project.category}
                  </span>
                </div>

                {/* Text Description Block */}
                <div className="p-6 sm:p-8 flex flex-col text-left flex-grow">
                  <h3 className="text-lg font-display font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-grow line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Footer metadata indicator */}
                  <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold mt-auto pt-4 border-t border-white/5">
                    <span>View Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Case Study Detail Modal Popup */}
        <AnimatePresence>
          {activeProject && (
            <>
              {/* Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveProject(null)}
                className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
              >
                {/* Modal body */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  onClick={(e) => e.stopPropagation()} // Stop overlay click close
                  className="bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col"
                >
                  {/* Header Visual Hero */}
                  <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-zinc-950 overflow-hidden shrink-0">
                    <img
                      src={activeProject.image}
                      alt={activeProject.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/25 to-transparent" />
                    
                    {/* Header Info Banner overlayed on image */}
                    <div className="absolute bottom-6 left-6 right-6 text-left text-white">
                      <span className="px-3 py-1 bg-blue-600 rounded-full text-[10px] font-mono tracking-widest font-bold uppercase mb-2 inline-block">
                        {activeProject.category}
                      </span>
                      <h4 className="text-xl sm:text-3xl font-display font-bold tracking-tight">
                        {activeProject.title}
                      </h4>
                    </div>

                    {/* Top right floating close action */}
                    <button
                      onClick={() => setActiveProject(null)}
                      className="absolute top-4 right-4 bg-black/45 hover:bg-black/65 text-white p-2.5 rounded-full backdrop-blur-md border border-white/10 transition-colors"
                      aria-label="Close details"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Scrollable details text block */}
                  <div className="p-6 sm:p-10 overflow-y-auto flex-grow text-left">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                      {/* Left: Summary description */}
                      <div className="md:col-span-8">
                        <h5 className="text-xs font-bold font-mono text-blue-400 uppercase tracking-wider mb-3">
                          Project Architecture &amp; Delivery
                        </h5>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 whitespace-pre-line">
                          {activeProject.details || activeProject.description}
                        </p>
                      </div>

                      {/* Right: Technical Metadata details */}
                      <div className="md:col-span-4 bg-zinc-950 p-6 rounded-2xl border border-white/5 flex flex-col gap-6">
                        <div>
                          <p className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-1">DESIGN DIVISION</p>
                          <p className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                            <Code2 className="w-3.5 h-3.5 text-blue-400" />
                            {activeProject.category}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest mb-1">DELIVERY METRIC</p>
                          <p className="text-xs font-semibold text-slate-200">Handcrafted, 100% Unique Architecture</p>
                        </div>

                        {activeProject.liveUrl && (
                          <div className="mt-auto pt-4 border-t border-white/5">
                            <a
                              href={activeProject.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-600/10 transition-colors"
                            >
                              <span>Launch Live Website</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
