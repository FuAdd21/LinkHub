import { Link } from "react-router-dom";
import { GripVertical, Plus } from "lucide-react";
import "./QuickLinksToggle.css";

export default function QuickLinksToggle({
  links = [],
  onToggle = () => {},
  onAdd = null,
}) {
  const displayLinks = links.slice(0, 4);

  return (
    <div className="quick-links-container">
      {displayLinks.map((link) => {
        const isVisible = link.is_visible !== 0;

        return (
          <div key={link.id} className="quick-link-row">
            <div className="quick-link-left">
              <GripVertical className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 cursor-grab" />
              <span className="quick-link-title max-w-[180px]">
                {link.title || "Untitled Link"}
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isVisible}
              onClick={() => onToggle(link.id, isVisible)}
              className={`quick-toggle-switch ${
                isVisible ? "active" : "inactive"
              }`}
              title={isVisible ? "Hide link" : "Show link"}
            >
              <span className="quick-toggle-thumb" />
            </button>
          </div>
        );
      })}

      {/* Add Link Button */}
      {onAdd ? (
        <button type="button" onClick={onAdd} className="quick-add-btn">
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add link</span>
        </button>
      ) : (
        <Link to="/dashboard/links" className="quick-add-btn">
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add link</span>
        </Link>
      )}
    </div>
  );
}
