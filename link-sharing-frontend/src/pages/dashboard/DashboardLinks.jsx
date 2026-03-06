import React, { useState, useCallback } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Globe,
  X,
  Clock,
} from "lucide-react";
import {
  FaYoutube,
  FaGithub,
  FaTelegram,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaTiktok,
} from "react-icons/fa";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

const PLATFORM_ICONS = {
  youtube: { icon: FaYoutube, color: "#FF0000" },
  github: { icon: FaGithub, color: "#ffffff" },
  telegram: { icon: FaTelegram, color: "#0088cc" },
  instagram: { icon: FaInstagram, color: "#E4405F" },
  twitter: { icon: FaTwitter, color: "#1DA1F2" },
  linkedin: { icon: FaLinkedin, color: "#0A66C2" },
  tiktok: { icon: FaTiktok, color: "#ff0050" },
};

const DashboardLinks = ({ links: initialLinks, onRefresh }) => {
  const [links, setLinks] = useState(initialLinks || []);
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [form, setForm] = useState({
    title: "",
    url: "",
    scheduled_at: "",
  });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  React.useEffect(() => {
    setLinks(initialLinks || []);
  }, [initialLinks]);

  const openAddModal = () => {
    setEditingLink(null);
    setForm({ title: "", url: "", scheduled_at: "" });
    setShowModal(true);
  };

  const openEditModal = (link) => {
    setEditingLink(link);
    setForm({
      title: link.title,
      url: link.url,
      scheduled_at: link.scheduled_at
        ? new Date(link.scheduled_at).toISOString().slice(0, 16)
        : "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingLink) {
        await axios.put(
          `${API_BASE_URL}/api/mylinks/${editingLink.id}`,
          form,
          { headers }
        );
        toast.success("Link updated!");
      } else {
        await axios.post(`${API_BASE_URL}/api/mylinks`, form, { headers });
        toast.success("Link added!");
      }

      setShowModal(false);
      onRefresh?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save link");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this link?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/mylinks/${id}`, { headers });
      toast.success("Link deleted");
      onRefresh?.();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/mylinks/${id}/visibility`,
        {},
        { headers }
      );
      // Update local state
      setLinks((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, is_visible: l.is_visible ? 0 : 1 } : l
        )
      );
      onRefresh?.();
    } catch {
      toast.error("Failed to toggle visibility");
    }
  };

  const handleReorder = async (newOrder) => {
    setLinks(newOrder);

    // Debounced save
    try {
      const orderedIds = newOrder.map((l) => l.id);
      await axios.put(
        `${API_BASE_URL}/api/mylinks/order`,
        { order: orderedIds },
        { headers }
      );
    } catch {
      toast.error("Failed to save order");
    }
  };

  const getPlatformIcon = (platform) => {
    const config = PLATFORM_ICONS[platform];
    if (!config) return <Globe className="w-4 h-4 text-white/40" />;
    const IconComponent = config.icon;
    return <IconComponent className="w-4 h-4" style={{ color: config.color }} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Links</h2>
          <p className="text-white/40 text-sm mt-1">
            Manage and organize your links
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </motion.button>
      </div>

      {/* Links list with reorder */}
      {links.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🔗</div>
          <p className="text-white/40 text-sm">No links yet. Add your first link!</p>
        </div>
      ) : (
        <Reorder.Group
          values={links}
          onReorder={handleReorder}
          className="space-y-2"
        >
          {links.map((link) => (
            <Reorder.Item
              key={link.id}
              value={link}
              className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl group cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-4 h-4 text-white/20 flex-shrink-0" />

              {/* Platform icon */}
              <div className="flex-shrink-0">
                {getPlatformIcon(link.platform || link.icon)}
              </div>

              {/* Link info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    link.is_visible ? "text-white" : "text-white/30"
                  }`}
                >
                  {link.title}
                </p>
                <p className="text-white/20 text-xs truncate">{link.url}</p>
              </div>

              {/* Scheduled indicator */}
              {link.scheduled_at && (
                <Clock className="w-3.5 h-3.5 text-yellow-500/60 flex-shrink-0" />
              )}

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleToggleVisibility(link.id)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  title={link.is_visible ? "Hide" : "Show"}
                >
                  {link.is_visible ? (
                    <Eye className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-white/30" />
                  )}
                </button>
                <button
                  onClick={() => openEditModal(link)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-white/40" />
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400/60" />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg">
                  {editingLink ? "Edit Link" : "Add Link"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white/30 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/60 text-sm mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="My YouTube Channel"
                    required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm
                             focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/60 text-sm mb-1.5">
                    URL
                  </label>
                  <input
                    type="url"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    placeholder="https://youtube.com/@username"
                    required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm
                             focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/60 text-sm mb-1.5">
                    <Clock className="w-3.5 h-3.5 inline mr-1" />
                    Schedule (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={form.scheduled_at}
                    onChange={(e) =>
                      setForm({ ...form, scheduled_at: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm
                             focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 bg-white/5 text-white/60 rounded-xl text-sm hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium hover:opacity-90"
                  >
                    {editingLink ? "Update" : "Add Link"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DashboardLinks;
