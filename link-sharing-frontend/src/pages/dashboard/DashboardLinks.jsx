import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import LinkList from "../../Components/dashboard/LinkList";
import { API_BASE_URL, getDashboardAuthConfig } from "../../api/dashboardApi";

const MotionDiv = motion.div;

const initialFormState = {
  title: "",
  url: "",
  scheduled_at: "",
};

function LinkModal({ form, editingLink, isOpen, onClose, onChange, onSubmit }) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--saas-bg-main)]/60 px-4 backdrop-blur-md"
          onClick={onClose}
        >
          <MotionDiv
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg rounded-[32px] border border-[var(--saas-border)] bg-[var(--saas-card)] p-8 shadow-2xl shadow-black/40 ring-1 ring-white/10"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 mb-8">
              <div>
                 <div className="inline-flex items-center gap-2 rounded-full border border-[var(--saas-border)] bg-[var(--saas-bg-surface)] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-[var(--saas-accent-primary)] mb-4">
                    Link Forge
                 </div>
                <h3 className="text-2xl font-black text-[var(--saas-text-primary)] tracking-tight">
                  {editingLink ? "Refine destination" : "New entry"}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-surface)] text-[var(--saas-text-secondary)] hover:text-[var(--saas-text-primary)] transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)] ml-1"
                  htmlFor="title"
                >
                  Label Title
                </label>
                <div className="group relative">
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--saas-accent-primary)] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 rounded-full" />
                  <input
                    id="title"
                    required
                    value={form.title}
                    onChange={(event) => onChange("title", event.target.value)}
                    placeholder="e.g. Portfolio v2"
                    className="w-full bg-[var(--saas-bg-elevated)]/50 rounded-2xl border border-[var(--saas-border)] px-5 py-4 text-sm font-bold text-[var(--saas-text-primary)] outline-none placeholder:text-[var(--saas-text-secondary)]/40 hover:border-[var(--saas-border-hover)] focus:border-[var(--saas-accent-primary)]/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)] ml-1"
                  htmlFor="url"
                >
                  URL Destination
                </label>
                <div className="group relative">
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--saas-accent-primary)] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 rounded-full" />
                  <input
                    id="url"
                    required
                    type="url"
                    value={form.url}
                    onChange={(event) => onChange("url", event.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[var(--saas-bg-elevated)]/50 rounded-2xl border border-[var(--saas-border)] px-5 py-4 text-sm font-bold text-[var(--saas-text-primary)] outline-none placeholder:text-[var(--saas-text-secondary)]/40 hover:border-[var(--saas-border-hover)] focus:border-[var(--saas-accent-primary)]/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)] ml-1"
                  htmlFor="schedule"
                >
                  Activation Schedule <span className="text-[var(--saas-accent-primary)] opacity-50">(Optional)</span>
                </label>
                <input
                  id="schedule"
                  type="datetime-local"
                  value={form.scheduled_at}
                  onChange={(event) =>
                    onChange("scheduled_at", event.target.value)
                  }
                  className="w-full bg-[var(--saas-bg-elevated)]/50 rounded-2xl border border-[var(--saas-border)] px-5 py-4 text-sm font-bold text-[var(--saas-text-primary)] outline-none hover:border-[var(--saas-border-hover)] focus:border-[var(--saas-accent-primary)]/50 transition-all [color-scheme:dark]"
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <button
                  type="submit"
                  className="flex-1 h-14 rounded-2xl bg-[var(--saas-accent-gradient)] text-sm font-black text-white shadow-lg shadow-[var(--saas-accent-glow)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {editingLink ? "Commit Refinement" : "Launch Link"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 h-14 rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-surface)] text-sm font-bold text-[var(--saas-text-primary)] hover:bg-[var(--saas-bg-elevated)] transition-all"
                >
                  Abort
                </button>
              </div>
            </form>
          </MotionDiv>
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  );
}

export default function DashboardLinks({
  links: initialLinks,
  onRefresh,
  onLinksChange,
}) {
  const [links, setLinks] = useState(initialLinks || []);
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    setLinks(initialLinks || []);
  }, [initialLinks]);

  function syncLinks(nextLinks) {
    setLinks(nextLinks);
    onLinksChange?.(nextLinks);
  }

  function openAddModal() {
    setEditingLink(null);
    setForm(initialFormState);
    setShowModal(true);
  }

  function openEditModal(link) {
    setEditingLink(link);
    setForm({
      title: link.title,
      url: link.url,
      scheduled_at: link.scheduled_at
        ? new Date(link.scheduled_at).toISOString().slice(0, 16)
        : "",
    });
    setShowModal(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      if (editingLink) {
        const response = await axios.put(
          `${API_BASE_URL}/api/mylinks/${editingLink.id}`,
          form,
          getDashboardAuthConfig(),
        );

        const nextLinks = links.map((link) =>
          link.id === editingLink.id ? response.data.link : link,
        );
        syncLinks(nextLinks);
        toast.success("Design parameters committed");
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/api/mylinks`,
          form,
          getDashboardAuthConfig(),
        );

        const nextLinks = [...links, response.data.link].sort(
          (left, right) => (left.position ?? 0) - (right.position ?? 0),
        );
        syncLinks(nextLinks);
        toast.success("New destination forged");
      }

      setShowModal(false);
      setForm(initialFormState);
      setEditingLink(null);
      onRefresh?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Forge operation failed");
    }
  }

  async function handleDelete(linkId) {
    if (!confirm("Are you sure you want to dismantle this link?")) {
      return;
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/api/mylinks/${linkId}`,
        getDashboardAuthConfig(),
      );
      const nextLinks = links.filter((link) => link.id !== linkId);
      syncLinks(nextLinks);
      onRefresh?.();
      toast.success("Link dismantled");
    } catch {
      toast.error("Process interruption: Delete failed");
    }
  }

  async function handleToggleVisibility(linkId) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/mylinks/${linkId}/visibility`,
        {},
        getDashboardAuthConfig(),
      );

      const nextLinks = links.map((link) =>
        link.id === linkId
          ? { ...link, is_visible: response.data.link.is_visible }
          : link,
      );
      syncLinks(nextLinks);
      onRefresh?.();
    } catch {
      toast.error("Visibility toggle failed");
    }
  }

  async function handleReorder(nextOrder) {
    const previousLinks = links;
    const withPositions = nextOrder.map((link, index) => ({
      ...link,
      position: index,
    }));

    syncLinks(withPositions);

    try {
      await axios.put(
        `${API_BASE_URL}/api/mylinks/order`,
        { order: withPositions.map((link) => link.id) },
        getDashboardAuthConfig(),
      );
      onRefresh?.();
    } catch {
      toast.error("Sync error: Reordering failed");
      syncLinks(previousLinks);
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
        <div className="max-w-xl">
           <div className="flex items-center gap-2 mb-3">
              <Link2 className="h-4 w-4 text-[var(--saas-accent-primary)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--saas-accent-primary)]">Link Orchestration</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--saas-text-primary)] sm:text-4xl">
            Keep your digital estate clean and high-converting
          </h1>
          <p className="mt-4 text-[15px] font-medium leading-relaxed text-[var(--saas-text-secondary)]">
            Organize destination URLs, hide outdated campaigns, and schedule future launches for seamless digital delivery.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="group inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-[var(--saas-accent-gradient)] px-8 text-[15px] font-black text-white transition-all hover:scale-105 shadow-lg shadow-[var(--saas-accent-glow)]/20 active:scale-95"
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          Add High-Impact Link
        </button>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="order-2 xl:order-1">
          <LinkList
            links={links}
            onReorder={handleReorder}
            onToggleVisibility={handleToggleVisibility}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
        
        <div className="order-1 xl:order-2 space-y-6">
          <DashboardCard className="p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--saas-accent-primary)]/10 text-[var(--saas-accent-primary)] mb-6">
                <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--saas-text-secondary)] mb-2">
                Strategic Logic
            </p>
            <h3 className="text-xl font-extrabold text-[var(--saas-text-primary)] tracking-tight">
                Less clutter, more clicks
            </h3>
            <div className="mt-8 space-y-4">
              {[
                  "Highlight active campaigns for today's visitors.",
                  "Archive seasonal links instead of dismantling stats.",
                  "Prep launches in advance with scheduled logic."
              ].map((text, i) => (
                  <div key={i} className="flex gap-4 group">
                      <div className="mt-1 h-5 w-5 shrink-0 rounded-full border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)] flex items-center justify-center text-[10px] font-black text-[var(--saas-text-secondary)] group-hover:border-[var(--saas-accent-primary)] group-hover:text-[var(--saas-accent-primary)] transition-colors">
                          {i+1}
                      </div>
                      <p className="text-sm font-semibold text-[var(--saas-text-secondary)] leading-relaxed group-hover:text-[var(--saas-text-primary)] transition-colors">
                          {text}
                      </p>
                  </div>
              ))}
            </div>
            
            <button className="mt-10 w-full py-4 rounded-2xl border border-[var(--saas-border)] bg-[var(--saas-bg-elevated)] text-[12px] font-black text-[var(--saas-text-primary)] hover:bg-[var(--saas-bg-surface)] transition-all">
                Learn Strategy →
            </button>
          </DashboardCard>
          
          <div className="rounded-[32px] overflow-hidden bg-[var(--saas-accent-gradient)] p-8 text-white relative group">
              <div className="relative z-10 flex flex-col h-full">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-4">Pro Tip</p>
                  <h4 className="text-xl font-black leading-tight italic">"Clean profiles convert 42% higher."</h4>
                  <p className="mt-4 text-xs font-bold leading-relaxed opacity-90">Keep your live link count under 7 for maximum engagement.</p>
              </div>
              <TrendingUp className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10 -rotate-12 group-hover:scale-125 transition-transform duration-700" />
          </div>
        </div>
      </div>

      <LinkModal
        isOpen={showModal}
        editingLink={editingLink}
        form={form}
        onClose={() => setShowModal(false)}
        onChange={(key, value) =>
          setForm((currentForm) => ({ ...currentForm, [key]: value }))
        }
        onSubmit={handleSubmit}
      />
    </div>
  );
}
