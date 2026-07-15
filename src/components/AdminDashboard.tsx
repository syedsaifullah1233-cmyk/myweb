import { useState, ChangeEvent, FormEvent } from 'react';
import { Project, WebsiteContent, ServiceItem, TestimonialItem, FaqItem } from '../types';
import { api } from '../lib/api';
import { 
  X, LayoutGrid, Sparkles, Image, Eye, EyeOff, Star, Trash2, Plus, Save, Edit, 
  HelpCircle, MessageSquare, PhoneCall, Info, ListTodo, CheckCircle2, ChevronRight, Upload
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminDashboardProps {
  projects: Project[];
  content: WebsiteContent;
  onClose: () => void;
  onRefreshData: () => void;
}

export default function AdminDashboard({ projects, content, onClose, onRefreshData }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'hero' | 'about' | 'services' | 'testimonials' | 'faq' | 'contact'>('projects');
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // PROJECT EDIT/ADD FORM STATES
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectForm, setProjectForm] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    details: '',
    category: 'Web Development',
    image: '',
    thumbnail: '',
    liveUrl: '',
    isLive: false,
    featured: false,
    hidden: false
  });

  // CONTENT EDIT SUB-STATES
  const [heroForm, setHeroForm] = useState(content.hero);
  const [aboutForm, setAboutForm] = useState(content.about);
  const [servicesForm, setServicesForm] = useState<ServiceItem[]>(content.services);
  const [testimonialsForm, setTestimonialsForm] = useState<TestimonialItem[]>(content.testimonials);
  const [faqForm, setFaqForm] = useState<FaqItem[]>(content.faq);
  const [contactForm, setContactForm] = useState({
    ...content.contact,
    instagram: content.social.instagram,
    facebook: content.social.facebook,
    socialEmail: content.social.email
  });

  // Helper trigger to show saving banners
  const triggerStatus = (success: boolean, message: string) => {
    setSaveStatus({ success, message });
    setTimeout(() => setSaveStatus(null), 4000);
  };

  // --- GENERAL IMAGE FILE UPLOADING UTILITY ---
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, targetField: 'image' | 'thumbnail' | 'heroImage' | 'testimonialAvatar' | string, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const relativeUrl = await api.uploadFile(file);
      callback(relativeUrl);
      triggerStatus(true, `Successfully uploaded image: ${file.name}`);
    } catch (err: any) {
      triggerStatus(false, err.message || 'Image upload failed.');
    } finally {
      setLoading(false);
    }
  };

  // --- PROJECT MANAGEMENT HANDLERS ---
  const handleOpenAddProject = () => {
    setIsAddingProject(true);
    setEditingProject(null);
    setProjectForm({
      title: '',
      description: '',
      details: '',
      category: 'Web Development',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
      liveUrl: '',
      isLive: false,
      featured: false,
      hidden: false
    });
  };

  const handleOpenEditProject = (p: Project) => {
    setEditingProject(p);
    setIsAddingProject(false);
    setProjectForm({ ...p });
  };

  const handleSaveProjectSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim() || !projectForm.description.trim()) {
      triggerStatus(false, 'Please complete the Project Title and Description.');
      return;
    }

    setLoading(true);
    try {
      if (editingProject) {
        // Edit existing project
        await api.updateProject(editingProject.id, projectForm);
        triggerStatus(true, `Case study "${projectForm.title}" successfully updated.`);
      } else {
        // Add new project
        await api.addProject(projectForm);
        triggerStatus(true, `New Case study "${projectForm.title}" successfully added.`);
      }
      setIsAddingProject(false);
      setEditingProject(null);
      onRefreshData();
    } catch (err: any) {
      triggerStatus(false, err.message || 'Failed to persist project changes.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Are you absolutely sure you want to permanently delete "${title}"?`)) return;
    setLoading(true);
    try {
      await api.deleteProject(id);
      triggerStatus(true, `Successfully deleted "${title}".`);
      onRefreshData();
    } catch (err: any) {
      triggerStatus(false, err.message || 'Failed to delete case study.');
    } finally {
      setLoading(false);
    }
  };

  // --- CONTENT PERSISTENCE ACTIONS ---
  const handleSaveAllContent = async () => {
    setLoading(true);
    try {
      const mergedPayload: WebsiteContent = {
        hero: heroForm,
        about: aboutForm,
        services: servicesForm,
        testimonials: testimonialsForm,
        faq: faqForm,
        contact: {
          email: contactForm.email,
          phone: contactForm.phone,
          address: contactForm.address
        },
        social: {
          instagram: contactForm.instagram,
          facebook: contactForm.facebook,
          email: contactForm.socialEmail
        }
      };

      await api.updateContent(mergedPayload);
      triggerStatus(true, 'Website content blocks updated and deployed successfully.');
      onRefreshData();
    } catch (err: any) {
      triggerStatus(false, err.message || 'Failed to deploy content modifications.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-50 overflow-hidden flex items-center justify-center p-4 lg:p-8">
      
      {/* Central Admin Box */}
      <div className="bg-zinc-900 border border-white/5 text-slate-100 rounded-3xl w-full h-[90vh] max-w-7xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* TOP BAR BAR */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2 className="font-display font-bold text-lg leading-tight text-white">Aura Pixel Custom Suite</h2>
              <p className="text-[10px] font-mono text-slate-500">ADMIN CONTROL CENTER &bull; SECURED CONSOLE</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick status message */}
            {saveStatus && (
              <div className={`px-4 py-2 rounded-xl text-xs font-semibold ${saveStatus.success ? 'bg-emerald-950/80 border border-emerald-900/30 text-emerald-400' : 'bg-rose-950/80 border border-rose-900/30 text-rose-400'}`}>
                {saveStatus.message}
              </div>
            )}
            
            <button
              onClick={onClose}
              className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
              aria-label="Exit dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* WORKSPACE DIVIDED INTO LEFT TABS & RIGHT PANEL */}
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          
          {/* TAB SIDEBAR (Left) */}
          <div className="w-full md:w-64 bg-zinc-950/30 border-b md:border-b-0 md:border-r border-white/5 p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible shrink-0 text-left">
            
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'projects' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' : 'hover:bg-zinc-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <span>Projects Showcase</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'hero' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' : 'hover:bg-zinc-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Hero Section</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'about' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' : 'hover:bg-zinc-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Info className="w-4 h-4 shrink-0" />
              <span>About Section</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'services' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' : 'hover:bg-zinc-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListTodo className="w-4 h-4 shrink-0" />
              <span>Services List</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'testimonials' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' : 'hover:bg-zinc-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Testimonials</span>
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'faq' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' : 'hover:bg-zinc-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>FAQs Accordions</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('contact');
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'contact' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' : 'hover:bg-zinc-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>Contact &amp; Social</span>
            </button>

          </div>

          {/* ACTIVE PANEL CONTENT (Right) */}
          <div className="flex-grow p-6 lg:p-8 overflow-y-auto text-left relative bg-zinc-950/15">
            
            {/* 1. PROJECTS SHOWCASE TAB */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                
                {/* Panel Action Header */}
                {!isAddingProject && !editingProject ? (
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">Portfolio Case Studies</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Manage and organize visual case studies exhibited on the frontend.</p>
                    </div>
                    <button
                      onClick={handleOpenAddProject}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add Case Study
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">
                        {editingProject ? `Edit Case Study: ${editingProject.title}` : 'Add New Case Study'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Edit assets, titles, metrics, and live indicators below.</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsAddingProject(false);
                        setEditingProject(null);
                      }}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Subform layout for Project Adding/Editing */}
                {(isAddingProject || editingProject) ? (
                  <form onSubmit={handleSaveProjectSubmit} className="space-y-6 bg-zinc-900 border border-white/5 p-6 rounded-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Name / Title</label>
                        <input
                          type="text"
                          required
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white font-medium"
                          placeholder="e.g., Aether Creative Studio"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category Filter</label>
                        <select
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                          className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-300 font-medium cursor-pointer"
                        >
                          <option value="Web Design" className="bg-zinc-900 text-white">Web Design</option>
                          <option value="Web Development" className="bg-zinc-900 text-white">Web Development</option>
                          <option value="UI/UX & Frontend" className="bg-zinc-900 text-white">UI/UX &amp; Frontend</option>
                          <option value="Creative Tech" className="bg-zinc-900 text-white">Creative Tech</option>
                        </select>
                      </div>

                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Short Brief Description</label>
                      <input
                        type="text"
                        required
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white font-medium"
                        placeholder="e.g., Immersive layout-shifting portfolio designed for high-end architects."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Long Narrative Case Study (Supports line-breaks)</label>
                      <textarea
                        rows={5}
                        value={projectForm.details}
                        onChange={(e) => setProjectForm({ ...projectForm, details: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white font-medium resize-none"
                        placeholder="Describe structural specifications, typography pairings, client results, and key delivery metrics..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* High-res Image path or Upload */}
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          High Resolution Image URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={projectForm.image}
                            onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                            className="flex-grow px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-white font-medium"
                          />
                          <label className="px-3 bg-zinc-850 hover:bg-zinc-750 border border-white/5 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer text-white">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, 'image', (url) => setProjectForm(prev => ({ ...prev, image: url })))}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Thumbnail path or Upload */}
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Card Thumbnail Image URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={projectForm.thumbnail}
                            onChange={(e) => setProjectForm({ ...projectForm, thumbnail: e.target.value })}
                            className="flex-grow px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-white font-medium"
                          />
                          <label className="px-3 bg-zinc-850 hover:bg-zinc-750 border border-white/5 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer text-white">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, 'thumbnail', (url) => setProjectForm(prev => ({ ...prev, thumbnail: url })))}
                            />
                          </label>
                        </div>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Live Website Link (Optional)</label>
                        <input
                          type="url"
                          value={projectForm.liveUrl}
                          onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                          className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white font-medium"
                          placeholder="https://aether-architecture.example.com"
                        />
                      </div>

                      {/* Status Badges checkbox flags */}
                      <div className="flex items-center gap-8 pt-6">
                        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-300">
                          <input
                            type="checkbox"
                            checked={projectForm.isLive}
                            onChange={(e) => setProjectForm({ ...projectForm, isLive: e.target.checked })}
                            className="w-4.5 h-4.5 bg-zinc-950 border border-white/10 rounded accent-blue-600"
                          />
                          <span>Show in &quot;Live Projects&quot;</span>
                        </label>

                        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-300">
                          <input
                            type="checkbox"
                            checked={projectForm.featured}
                            onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                            className="w-4.5 h-4.5 bg-zinc-950 border border-white/10 rounded accent-blue-600"
                          />
                          <span>Mark Featured</span>
                        </label>

                        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-300">
                          <input
                            type="checkbox"
                            checked={projectForm.hidden}
                            onChange={(e) => setProjectForm({ ...projectForm, hidden: e.target.checked })}
                            className="w-4.5 h-4.5 bg-zinc-950 border border-white/10 rounded accent-blue-600"
                          />
                          <span>Hide Project</span>
                        </label>
                      </div>

                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all cursor-pointer"
                    >
                      {loading ? 'Processing Transaction...' : 'Deploy Case Study'}
                    </button>

                  </form>
                ) : (
                  /* Standard projects table */
                  <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 text-[10px] font-bold font-mono tracking-widest text-slate-400 bg-zinc-950/40">
                            <th className="p-4">PROJECT DETAIL</th>
                            <th className="p-4">DIVISION</th>
                            <th className="p-4">STATUSES</th>
                            <th className="p-4 text-right">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                          {projects.map((proj) => (
                            <tr key={proj.id} className="hover:bg-zinc-800/30">
                              <td className="p-4 flex items-center gap-3 text-left">
                                <img
                                  src={proj.thumbnail || proj.image}
                                  alt={proj.title}
                                  className="w-10 h-10 object-cover rounded-lg border border-white/5 shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <p className="font-semibold text-white">{proj.title}</p>
                                  <p className="text-xs text-slate-400 line-clamp-1 max-w-[280px]">{proj.description}</p>
                                </div>
                              </td>
                              <td className="p-4 text-xs font-semibold text-slate-300">
                                {proj.category}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  {proj.featured && (
                                    <span className="px-2 py-0.5 bg-amber-950 text-amber-400 text-[9px] font-bold font-mono rounded border border-amber-900 flex items-center gap-1">
                                      <Star className="w-2.5 h-2.5 fill-amber-400" />
                                      FEAT
                                    </span>
                                  )}
                                  {proj.isLive && (
                                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[9px] font-bold font-mono rounded border border-emerald-900">
                                      LIVE
                                    </span>
                                  )}
                                  {proj.hidden ? (
                                    <span className="px-2 py-0.5 bg-rose-950 text-rose-400 text-[9px] font-bold font-mono rounded border border-rose-900 flex items-center gap-1">
                                      <EyeOff className="w-2.5 h-2.5" />
                                      HIDDEN
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-zinc-800 text-slate-400 text-[9px] font-bold font-mono rounded flex items-center gap-1">
                                      <Eye className="w-2.5 h-2.5" />
                                      VISIBLE
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleOpenEditProject(proj)}
                                    className="p-2 bg-zinc-800 hover:bg-blue-900 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                                    title="Edit Project"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProject(proj.id, proj.title)}
                                    className="p-2 bg-zinc-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                                    title="Delete Project"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 2. HERO SECTION TAB */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">Hero Canvas Content</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Edit main billboard headline copies, descriptions, and call-to-actions.</p>
                  </div>
                  <button
                    onClick={handleSaveAllContent}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Deploy Changes
                  </button>
                </div>

                <div className="space-y-6 bg-zinc-900 border border-white/5 p-6 rounded-2xl">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Main Headline Copy</label>
                    <input
                      type="text"
                      value={heroForm.title}
                      onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detailed Paragraph Description</label>
                    <textarea
                      rows={3}
                      value={heroForm.subtitle}
                      onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white font-medium resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary CTA Label</label>
                      <input
                        type="text"
                        value={heroForm.ctaText}
                        onChange={(e) => setHeroForm({ ...heroForm, ctaText: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary CTA Anchor/Link</label>
                      <input
                        type="text"
                        value={heroForm.ctaLink}
                        onChange={(e) => setHeroForm({ ...heroForm, ctaLink: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Secondary CTA Label</label>
                      <input
                        type="text"
                        value={heroForm.secondaryCtaText}
                        onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaText: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Secondary CTA Anchor/Link</label>
                      <input
                        type="text"
                        value={heroForm.secondaryCtaLink}
                        onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaLink: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hero Showcase Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={heroForm.heroImage}
                        onChange={(e) => setHeroForm({ ...heroForm, heroImage: e.target.value })}
                        className="flex-grow px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-white font-medium"
                      />
                      <label className="px-4 bg-zinc-850 hover:bg-zinc-750 border border-white/5 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer text-white shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'heroImage', (url) => setHeroForm(prev => ({ ...prev, heroImage: url })))}
                        />
                      </label>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 3. ABOUT SECTION TAB */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">About Narrative &amp; Stats</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Manage historical stories, copy details, and dynamic metrics panels.</p>
                  </div>
                  <button
                    onClick={handleSaveAllContent}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Deploy Changes
                  </button>
                </div>

                <div className="space-y-6 bg-zinc-900 border border-white/5 p-6 rounded-2xl">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Headline</label>
                    <input
                      type="text"
                      value={aboutForm.headline}
                      onChange={(e) => setAboutForm({ ...aboutForm, headline: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Narrative Brand Story</label>
                    <textarea
                      rows={5}
                      value={aboutForm.story}
                      onChange={(e) => setAboutForm({ ...aboutForm, story: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white font-medium resize-none"
                    />
                  </div>

                  {/* Metrics grid inputs */}
                  <div>
                    <h4 className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Bento Grid Statistics metrics</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {aboutForm.metrics?.map((metric, index) => (
                        <div key={index} className="p-4 bg-zinc-950 border border-white/5 rounded-xl space-y-3">
                          <p className="text-xs font-bold text-blue-400 font-mono">STAT CELL #{index + 1}</p>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Metric Value</label>
                            <input
                              type="text"
                              value={metric.value}
                              onChange={(e) => {
                                const copy = [...aboutForm.metrics];
                                copy[index].value = e.target.value;
                                setAboutForm({ ...aboutForm, metrics: copy });
                              }}
                              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold mb-1 uppercase">Metric Label</label>
                            <input
                              type="text"
                              value={metric.label}
                              onChange={(e) => {
                                const copy = [...aboutForm.metrics];
                                copy[index].label = e.target.value;
                                setAboutForm({ ...aboutForm, metrics: copy });
                              }}
                              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 4. SERVICES LIST TAB */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">Services List &amp; Features</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Fine-tune descriptors, titles, and sub-checklists for our 9 product cards.</p>
                  </div>
                  <button
                    onClick={handleSaveAllContent}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Deploy Changes
                  </button>
                </div>

                <div className="space-y-6">
                  {servicesForm.map((serv, index) => (
                    <div key={serv.id} className="p-6 bg-zinc-900 border border-white/5 rounded-2xl flex flex-col gap-4 text-left">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-blue-400 font-mono">SERVICE CARD #{index + 1} ({serv.id})</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Service Title</label>
                          <input
                            type="text"
                            value={serv.title}
                            onChange={(e) => {
                              const copy = [...servicesForm];
                              copy[index].title = e.target.value;
                              setServicesForm(copy);
                            }}
                            className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Lucide Icon Identifier</label>
                          <input
                            type="text"
                            value={serv.iconName}
                            onChange={(e) => {
                              const copy = [...servicesForm];
                              copy[index].iconName = e.target.value;
                              setServicesForm(copy);
                            }}
                            className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-sm font-mono text-blue-400 focus:outline-none focus:border-blue-500"
                            placeholder="Building2, Code2, Flame, etc."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Card Description</label>
                        <input
                          type="text"
                          value={serv.description}
                          onChange={(e) => {
                            const copy = [...servicesForm];
                              copy[index].description = e.target.value;
                              setServicesForm(copy);
                          }}
                          className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* Bullet checkmarks list */}
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-2">Bullet points lists (comma separated)</label>
                        <input
                          type="text"
                          value={serv.features?.join(', ')}
                          onChange={(e) => {
                            const copy = [...servicesForm];
                            copy[index].features = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            setServicesForm(copy);
                          }}
                          className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. TESTIMONIALS TAB */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">Client Testimonials</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Manage creative feedback sliders, author roles, and client photos.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const newTest: TestimonialItem = {
                          id: 'test-' + Date.now(),
                          clientName: 'New Client Name',
                          clientRole: 'Executive Officer',
                          clientCompany: 'Brand Labs',
                          feedback: 'Aura Pixel built a pristine digital experience.',
                          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
                        };
                        setTestimonialsForm([...testimonialsForm, newTest]);
                      }}
                      className="px-3.5 py-2 bg-zinc-850 hover:bg-zinc-750 border border-white/5 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Review
                    </button>
                    <button
                      onClick={handleSaveAllContent}
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      Deploy Changes
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {testimonialsForm.map((test, index) => (
                    <div key={test.id} className="p-6 bg-zinc-900 border border-white/5 rounded-2xl flex flex-col gap-4 text-left relative">
                      
                      <button
                        onClick={() => {
                          const copy = testimonialsForm.filter(t => t.id !== test.id);
                          setTestimonialsForm(copy);
                        }}
                        className="absolute top-4 right-4 p-2 bg-zinc-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-white/5 rounded-lg transition-colors cursor-pointer"
                        title="Delete review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-blue-400 font-mono">REVIEW CARD #{index + 1}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Author Name</label>
                          <input
                            type="text"
                            value={test.clientName}
                            onChange={(e) => {
                                const copy = [...testimonialsForm];
                                copy[index].clientName = e.target.value;
                                setTestimonialsForm(copy);
                            }}
                            className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Designation / Role</label>
                          <input
                            type="text"
                            value={test.clientRole}
                            onChange={(e) => {
                                const copy = [...testimonialsForm];
                                copy[index].clientRole = e.target.value;
                                setTestimonialsForm(copy);
                            }}
                            className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Client Company</label>
                          <input
                            type="text"
                            value={test.clientCompany}
                            onChange={(e) => {
                                const copy = [...testimonialsForm];
                                copy[index].clientCompany = e.target.value;
                                setTestimonialsForm(copy);
                            }}
                            className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Testimonial feedback text</label>
                        <textarea
                          rows={3}
                          value={test.feedback}
                          onChange={(e) => {
                            const copy = [...testimonialsForm];
                            copy[index].feedback = e.target.value;
                            setTestimonialsForm(copy);
                          }}
                          className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white resize-none focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* Avatar upload */}
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Client Profile Photo URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={test.avatar}
                            onChange={(e) => {
                                const copy = [...testimonialsForm];
                                copy[index].avatar = e.target.value;
                                setTestimonialsForm(copy);
                            }}
                            className="flex-grow px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                          />
                          <label className="px-3.5 bg-zinc-850 hover:bg-zinc-750 border border-white/5 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer text-white shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, 'testimonialAvatar', (url) => {
                                const copy = [...testimonialsForm];
                                copy[index].avatar = url;
                                setTestimonialsForm(copy);
                              })}
                            />
                          </label>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. FAQ ACCORDIONS TAB */}
            {activeTab === 'faq' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">Frequently Asked Accordions</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Edit, delete, and add interactive, animated accordion panels.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const newFaq: FaqItem = {
                          id: 'faq-' + Date.now(),
                          question: 'New Question?',
                          answer: 'Provide a detailed support answer here.'
                        };
                        setFaqForm([...faqForm, newFaq]);
                      }}
                      className="px-3.5 py-2 bg-zinc-850 hover:bg-zinc-750 border border-white/5 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add FAQ
                    </button>
                    <button
                      onClick={handleSaveAllContent}
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      Deploy Changes
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {faqForm.map((item, index) => (
                    <div key={item.id} className="p-6 bg-zinc-900 border border-white/5 rounded-2xl flex flex-col gap-4 text-left relative">
                      
                      <button
                        onClick={() => {
                          const copy = faqForm.filter(f => f.id !== item.id);
                          setFaqForm(copy);
                        }}
                        className="absolute top-4 right-4 p-2 bg-zinc-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-white/5 rounded-lg transition-colors cursor-pointer"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-blue-400 font-mono">FAQ ACCORDION #{index + 1}</span>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Accordion Question</label>
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => {
                            const copy = [...faqForm];
                            copy[index].question = e.target.value;
                            setFaqForm(copy);
                          }}
                          className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Accordion Detailed Answer</label>
                        <textarea
                          rows={3}
                          value={item.answer}
                          onChange={(e) => {
                            const copy = [...faqForm];
                            copy[index].answer = e.target.value;
                            setFaqForm(copy);
                          }}
                          className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white resize-none focus:outline-none focus:border-blue-500"
                        />
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. CONTACT & SOCIAL TAB */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">Contact &amp; Social indices</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Define business coordinates, maps indicators, phone lines, and social links.</p>
                  </div>
                  <button
                    onClick={handleSaveAllContent}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Deploy Changes
                  </button>
                </div>

                <div className="space-y-6 bg-zinc-900 border border-white/5 p-6 rounded-2xl">
                  
                  <h4 className="block text-xs font-bold text-blue-400 font-mono border-b border-white/5 pb-2">Business Addresses &amp; Phones</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Business Contact Email</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Studio Telephone Line</label>
                      <input
                        type="text"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Physical Agency Address</label>
                    <input
                      type="text"
                      value={contactForm.address}
                      onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <h4 className="block text-xs font-bold text-blue-400 font-mono border-b border-white/5 pt-4 pb-2">Social Network Channels</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Instagram Link</label>
                      <input
                        type="url"
                        value={contactForm.instagram}
                        onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Facebook Link</label>
                      <input
                        type="url"
                        value={contactForm.facebook}
                        onChange={(e) => setContactForm({ ...contactForm, facebook: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Social Email Address</label>
                      <input
                        type="email"
                        value={contactForm.socialEmail}
                        onChange={(e) => setContactForm({ ...contactForm, socialEmail: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
