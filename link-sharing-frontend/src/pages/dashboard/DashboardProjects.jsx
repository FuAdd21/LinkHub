import { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Trash2,
  ExternalLink,
  Edit2,
  Sparkles,
  Check,
  Globe,
  Tag,
  ArrowUpRight,
  MoveUp,
  MoveDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { projectsApi } from "../../api/projectsApi.js";
import { api } from "../../api/config.js";
import { getErrorMessage } from "../../api/responseHandler.js";

export default function DashboardProjects({ userData, onUserChange }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [role, setRole] = useState("");
  const [techInput, setTechInput] = useState("");
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  // Primary CTA State
  const [ctaType, setCtaType] = useState(userData?.primary_cta_type || "view_work");
  const [ctaLabel, setCtaLabel] = useState(userData?.primary_cta_label || "");
  const [ctaUrl, setCtaUrl] = useState(userData?.primary_cta_url || "");
  const [savingCta, setSavingCta] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (userData) {
      setCtaType(userData.primary_cta_type || "view_work");
      setCtaLabel(userData.primary_cta_label || "");
      setCtaUrl(userData.primary_cta_url || "");
    }
  }, [userData]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsApi.getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load showcase projects"));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setUrl("");
    setRole("");
    setTechInput("");
    setFeatured(false);
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProject(p);
    setTitle(p.title || "");
    setDescription(p.description || "");
    setUrl(p.url || "");
    setRole(p.role || "");
    setTechInput(Array.isArray(p.technologies) ? p.technologies.join(", ") : "");
    setFeatured(Boolean(p.featured));
    setShowModal(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Project title is required");
      return;
    }

    setSaving(true);
    const techArray = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      url: url.trim() || null,
      role: role.trim() || null,
      technologies: techArray,
      featured,
    };

    try {
      if (editingProject) {
        const updated = await projectsApi.updateProject(editingProject.id, payload);
        setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? updated : p)));
        toast.success("Project updated");
      } else {
        const created = await projectsApi.createProject(payload);
        setProjects((prev) => [...prev, created]);
        toast.success("Project added to portfolio");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save project"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this project from your showcase?")) return;
    try {
      await projectsApi.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project removed");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete project"));
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newProjects = [...projects];
    const [moved] = newProjects.splice(index, 1);
    newProjects.splice(targetIndex, 0, moved);
    setProjects(newProjects);

    try {
      await projectsApi.reorderProjects(newProjects.map((p) => p.id));
    } catch (err) {
      toast.error("Failed to persist order");
      loadProjects();
    }
  };

  const handleSaveCta = async (e) => {
    e.preventDefault();
    setSavingCta(true);
    try {
      const res = await api.put("/api/profile", {
        primary_cta_type: ctaType,
        primary_cta_label: ctaLabel.trim() || null,
        primary_cta_url: ctaUrl.trim() || null,
      });
      if (onUserChange && res.data?.user) {
        onUserChange(res.data.user);
      }
      toast.success("Primary call-to-action updated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update call-to-action"));
    } finally {
      setSavingCta(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* ─── Hero / Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="text-[10px] font-mono font-medium tracking-[0.2em] text-[#c6f035] uppercase mb-1">
            PORTFOLIO DIFFERENTIATION
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Selected Work & Projects
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl leading-relaxed">
            Move beyond a simple link tree. Showcase projects, your specific role, and stack to turn visitors into clients and employers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#c6f035] hover:brightness-105 text-[#07080a] font-bold text-xs font-mono rounded-xl transition-all shadow-[0_2px_12px_rgba(198,240,53,0.2)] shrink-0 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Project</span>
        </button>
      </div>

      {/* ─── Primary CTA Card ─── */}
      <div className="border border-white/[0.08] bg-[#0c0d10] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#c6f035] uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>High-Conversion Primary Action</span>
        </div>
        <h2 className="text-lg font-bold text-white mb-2">
          Profile Call-to-Action (Hero Button)
        </h2>
        <p className="text-xs text-zinc-400 mb-6 max-w-2xl">
          Highlight your most important conversion goal directly beneath your profile bio (e.g. "Hire Me", "Book Call", "Download CV").
        </p>

        <form onSubmit={handleSaveCta} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase mb-2">
              Action Intent
            </label>
            <select
              value={ctaType}
              onChange={(e) => setCtaType(e.target.value)}
              className="w-full bg-[#121316] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#c6f035]"
            >
              <option value="view_work">View Selected Work</option>
              <option value="hire_me">Hire Me / Inquiries</option>
              <option value="book_call">Schedule / Book Call</option>
              <option value="download_cv">Download Resume / CV</option>
              <option value="contact">Direct Contact</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase mb-2">
              Button Label
            </label>
            <input
              type="text"
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              placeholder="e.g. Work with me"
              className="w-full bg-[#121316] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c6f035]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase mb-2">
              Destination URL
            </label>
            <input
              type="url"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              placeholder="https://cal.com/your-name"
              className="w-full bg-[#121316] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c6f035]"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingCta}
              className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs rounded-xl transition-all disabled:opacity-50"
            >
              {savingCta ? "Saving..." : "Save Primary Action"}
            </button>
          </div>
        </form>
      </div>

      {/* ─── Projects List ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-400">
            Showcase Projects ({projects.length})
          </h2>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl bg-[#0c0d10]">
            <Briefcase className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-white mb-1">No projects showcase yet</p>
            <p className="text-xs text-zinc-500 mb-4 max-w-sm mx-auto">
              Add key repositories, client deliverables, or portfolio highlights with technology tags.
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-[#c6f035] text-[#07080a] font-mono font-bold text-xs rounded-xl"
            >
              Add your first project
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-[#0c0d10] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-white group-hover:text-[#c6f035] transition-colors">
                      {p.title}
                    </span>
                    {p.featured && (
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#c6f035]/15 text-[#c6f035] border border-[#c6f035]/30">
                        Featured
                      </span>
                    )}
                    {p.role && (
                      <span className="text-xs font-mono text-zinc-400">
                        · {p.role}
                      </span>
                    )}
                  </div>

                  {p.description && (
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 max-w-xl">
                      {p.description}
                    </p>
                  )}

                  {p.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.technologies.map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, -1)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-20"
                    title="Move up"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === projects.length - 1}
                    onClick={() => handleMove(idx, 1)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-20"
                    title="Move down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>

                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                      title="Open project link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(p)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                    title="Edit project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Project Modal ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0c0d10] border border-white/10 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingProject ? "Edit Showcase Project" : "Add Showcase Project"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-zinc-500 hover:text-white text-xs font-mono uppercase"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Analytics Platform"
                  required
                  className="w-full bg-[#121316] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c6f035]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase mb-1.5">
                  Your Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lead Architect & Backend Engineer"
                  className="w-full bg-[#121316] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c6f035]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe what this project solved, metrics achieved, or scope."
                  rows={3}
                  className="w-full bg-[#121316] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c6f035] resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase mb-1.5">
                  Live URL or Repository
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/your-name/project"
                  className="w-full bg-[#121316] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c6f035]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase mb-1.5">
                  Technologies (Comma Separated)
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Node.js, PostgreSQL, Docker, Redis"
                  className="w-full bg-[#121316] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c6f035]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#121316] border-white/10 text-[#c6f035] focus:ring-0"
                />
                <label htmlFor="featured-checkbox" className="text-xs text-zinc-300 font-medium">
                  Feature this project with priority highlight badge
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#c6f035] text-[#07080a] font-bold font-mono text-xs hover:brightness-105 transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
