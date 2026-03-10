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
            className="w-full max-w-lg rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6 shadow-sm"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Link editor
                </p>
                <h3 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                  {editingLink ? "Update link" : "Add a new link"}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 hover:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-400 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  htmlFor="title"
                >
                  Title
                </label>
                <div className="mt-2 rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 focus-within:ring-1 focus-within:ring-black dark:focus-within:ring-white transition-shadow">
                  <input
                    id="title"
                    required
                    value={form.title}
                    onChange={(event) => onChange("title", event.target.value)}
                    placeholder="My latest video"
                    className="w-full bg-transparent text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  htmlFor="url"
                >
                  Destination URL
                </label>
                <div className="mt-2 rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 focus-within:ring-1 focus-within:ring-black dark:focus-within:ring-white transition-shadow">
                  <input
                    id="url"
                    required
                    type="url"
                    value={form.url}
                    onChange={(event) => onChange("url", event.target.value)}
                    placeholder="https://youtube.com/@username"
                    className="w-full bg-transparent text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  htmlFor="schedule"
                >
                  Schedule (optional)
                </label>
                <div className="mt-2 rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 focus-within:ring-1 focus-within:ring-black dark:focus-within:ring-white transition-shadow">
                  <input
                    id="schedule"
                    type="datetime-local"
                    value={form.scheduled_at}
                    onChange={(event) =>
                      onChange("scheduled_at", event.target.value)
                    }
                    className="w-full bg-transparent text-sm text-gray-900 dark:text-white outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 text-sm font-medium transition-colors"
                >
                  {editingLink ? "Save changes" : "Add link"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-900 text-sm font-medium transition-colors"
                >
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
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Links
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Keep your page clean, current, and easy to scan
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
            Reorder links, hide outdated campaigns, and schedule launches
            without cluttering the creator experience.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Link
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <LinkList
            links={links}
            onReorder={handleReorder}
            onToggleVisibility={handleToggleVisibility}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>
        <div className="h-fit rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Why this matters
          </p>
          <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
            Less clutter, more clicks
          </h3>
          <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-neutral-900 p-3">
              Highlight the links you want visitors to act on today.
            </div>
            <div className="rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-neutral-900 p-3">
              Hide seasonal campaigns instead of deleting historical
              performance.
            </div>
            <div className="rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-neutral-900 p-3">
              Use scheduling to prep launches before they go live.
            </div>
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
