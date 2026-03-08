import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardCard from "../../Components/dashboard/DashboardCard";
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
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <MotionDiv
            initial={{ y: 16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="dashboard-floating-panel w-full max-w-lg rounded-[28px] p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)]">Link editor</p>
                <h3 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">
                  {editingLink ? "Update link" : "Add a new link"}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--card-border)] bg-white/5 text-[var(--text-primary)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="dashboard-field-label" htmlFor="title">
                  Title
                </label>
                <div className="dashboard-input-shell mt-2">
                  <input
                    id="title"
                    required
                    value={form.title}
                    onChange={(event) => onChange("title", event.target.value)}
                    placeholder="My latest video"
                    className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                  />
                </div>
              </div>
              <div>
                <label className="dashboard-field-label" htmlFor="url">
                  Destination URL
                </label>
                <div className="dashboard-input-shell mt-2">
                  <input
                    id="url"
                    required
                    type="url"
                    value={form.url}
                    onChange={(event) => onChange("url", event.target.value)}
                    placeholder="https://youtube.com/@username"
                    className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                  />
                </div>
              </div>
              <div>
                <label className="dashboard-field-label" htmlFor="schedule">
                  Schedule (optional)
                </label>
                <div className="dashboard-input-shell mt-2">
                  <input
                    id="schedule"
                    type="datetime-local"
                    value={form.scheduled_at}
                    onChange={(event) => onChange("scheduled_at", event.target.value)}
                    className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button type="submit" className="dashboard-primary-button">
                  {editingLink ? "Save changes" : "Add link"}
                </button>
                <button type="button" onClick={onClose} className="dashboard-secondary-button">
                  Cancel
                </button>
              </div>
            </form>
          </MotionDiv>
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  );
}

export default function DashboardLinks({ links: initialLinks, onRefresh, onLinksChange }) {
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
        toast.success("Link updated");
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
        toast.success("Link added");
      }

      setShowModal(false);
      setForm(initialFormState);
      setEditingLink(null);
      onRefresh?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save link");
    }
  }

  async function handleDelete(linkId) {
    if (!confirm("Delete this link?")) {
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
      toast.success("Link deleted");
    } catch {
      toast.error("Failed to delete link");
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
      toast.error("Failed to update visibility");
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
      toast.error("Failed to save link order");
      syncLinks(previousLinks);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">Links</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            Keep your page clean, current, and easy to scan
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
            Reorder links, hide outdated campaigns, and schedule launches without
            cluttering the creator experience.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="dashboard-primary-button"
        >
          <Plus className="h-4 w-4" />
          Add New Link
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <LinkList
            links={links}
            onReorder={handleReorder}
            onToggleVisibility={handleToggleVisibility}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
        <DashboardCard className="h-fit">
          <p className="text-sm font-medium text-[var(--text-secondary)]">Why this matters</p>
          <h3 className="mt-3 text-xl font-semibold text-[var(--text-primary)]">
            Less clutter, more clicks
          </h3>
          <div className="mt-5 space-y-3 text-sm text-[var(--text-muted)]">
            <div className="rounded-[22px] border border-[var(--card-border)] bg-white/5 p-4">
              Highlight the links you want visitors to act on today.
            </div>
            <div className="rounded-[22px] border border-[var(--card-border)] bg-white/5 p-4">
              Hide seasonal campaigns instead of deleting historical performance.
            </div>
            <div className="rounded-[22px] border border-[var(--card-border)] bg-white/5 p-4">
              Use scheduling to prep launches before they go live.
            </div>
          </div>
        </DashboardCard>
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