import { Project } from '../types';
import { ExternalLink, Globe2 } from 'lucide-react';
import { motion } from 'motion/react';

interface LiveProjectsProps {
  projects: Project[];
}

export default function LiveProjects({ projects }: LiveProjectsProps) {
  // Only display non-hidden projects that are flagged as live and have an active URL
  const liveProjects = projects.filter(p => p.isLive && p.liveUrl && !p.hidden);

  return (
    <section id="live-projects" className="py-24 bg-[#0A0A0A] border-t border-white/5 relative overflow-hidden">
      {/* Abstract Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-bold font-mono text-blue-500 tracking-widest uppercase mb-4 inline-block">
            DEPLOYED SITES
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight mb-6">
            Live Web Deployments
          </h2>
          <p className="text-slate-400">
            Click to launch live, responsive client websites hosted on our optimized, lighting-fast server stacks. Explore our actual production deployments in the wild.
          </p>
        </div>

        {/* Live Projects Grid Layout */}
        {liveProjects.length === 0 ? (
          <div className="bg-zinc-900 p-12 rounded-3xl border border-white/5 max-w-md mx-auto text-center shadow-2xl">
            <Globe2 className="w-10 h-10 text-slate-600 mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-300">No Deployed Websites Active</p>
            <p className="text-xs text-slate-500 mt-1">Check back soon for new client platform launches.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {liveProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-500/20 transition-all duration-300 flex flex-col group h-full"
              >
                {/* Visual Mockup Cover */}
                <div className="aspect-[16/10] bg-zinc-950 overflow-hidden relative border-b border-white/5">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {/* Floating live signal */}
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] font-bold font-mono tracking-widest uppercase flex items-center gap-1.5 shadow-md shadow-emerald-500/10">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    LIVE DEPLOYMENT
                  </div>
                </div>

                {/* Content description */}
                <div className="p-6 sm:p-8 flex flex-col text-left flex-grow">
                  <h3 className="font-display font-bold text-lg text-white mb-2 leading-snug group-hover:text-blue-400 transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6 flex-grow line-clamp-3">
                    {project.description}
                  </p>

                  {/* Visit Website action link */}
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white/5 hover:bg-blue-600 text-slate-200 hover:text-white border border-white/10 group-hover:border-blue-600 font-semibold rounded-xl text-xs tracking-wide transition-all duration-300 w-full mt-auto"
                  >
                    <span>Visit Live Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
