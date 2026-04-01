import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";
import {
  Zap,
  Send,
  FolderOpen,
  History,
  X,
  ChevronRight,
  Plus,
} from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { id: "tester", label: "API Tester", icon: Send },
  { id: "collections", label: "Collections", icon: FolderOpen },
  { id: "history", label: "History", icon: History },
];

const methodColors = {
  GET: "bg-emerald-500/15 text-emerald-600",
  POST: "bg-blue-500/15 text-blue-600",
  PUT: "bg-amber-500/15 text-amber-600",
  DELETE: "bg-red-500/15 text-red-600",
};

function MethodBadge({ method }) {
  return (
    <span
      className={cn(
        "px-1.5 py-0.5 text-[10px] font-bold rounded",
        methodColors[method] || "bg-muted text-muted-foreground"
      )}
    >
      {method}
    </span>
  );
}

function CollectionItem({
  collection,
  expandedCollections,
  onToggle,
  activeTabId,
  onRequestClick,
}) {
  const isExpanded = expandedCollections.includes(collection.id);

  return (
    <div>
      <button
        onClick={() => onToggle(collection.id)}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm"
      >
        <ChevronRight
          className={cn("w-4 h-4", isExpanded && "rotate-90")}
        />
        <FolderOpen className="w-4 h-4" />
        {collection.name}
      </button>

      {isExpanded && (
        <div className="ml-6">
          {collection.requests.map((req) => (
            <button
              key={req.id}
              onClick={() => onRequestClick(req, collection)}
              className={cn(
                "flex gap-2 w-full text-xs p-2 rounded",
                activeTabId === req.id
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-accent"
              )}
            >
              <MethodBadge method={req.method} />
              {req.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarContent() {
  const [expandedCollections, setExpandedCollections] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const collections = useWorkspaceStore((s) => s.collections);
  const openRequestTab = useWorkspaceStore((s) => s.openRequestTab);
  const activeTabId = useWorkspaceStore((s) => s.activeTabId);

  const toggleCollection = (id) => {
    setExpandedCollections((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleRequestClick = (req, col) => {
    openRequestTab(req, col);
    navigate("/workspace");
  };

  useEffect(() => {
    if (activeTabId) {
      const col = collections.find((c) =>
        c.requests.some((r) => r.id === activeTabId)
      );
      if (col && !expandedCollections.includes(col.id)) {
        setExpandedCollections((p) => [...p, col.id]);
      }
    }
  }, [activeTabId]);

  return (
    <>
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Zap />
          Frontend API
        </div>
      </div>

      <nav className="p-4">
        {navItems.map((item) => {
          const isActive =
            (item.id === "tester" && location.pathname === "/") ||
            location.pathname.startsWith(`/${item.id}`);

          return (
            <button
              key={item.id}
              onClick={() =>
                navigate(item.id === "tester" ? "/" : `/${item.id}`)
              }
              className={cn(
                "block w-full text-left p-2 rounded",
                isActive && "bg-primary text-white"
              )}
            >
              {item.label}
            </button>
          );
        })}

        <div className="mt-4">
          {collections.map((c) => (
            <CollectionItem
              key={c.id}
              collection={c}
              expandedCollections={expandedCollections}
              onToggle={toggleCollection}
              activeTabId={activeTabId}
              onRequestClick={handleRequestClick}
            />
          ))}
        </div>
      </nav>
    </>
  );
}

export function Sidebar() {
  return <SidebarContent />;
}

export function MobileSidebar({ isOpen, onClose }) {
  return isOpen ? (
    <div className="fixed inset-0 bg-black/40">
      <div className="w-72 bg-white h-full">
        <SidebarContent />
        <button onClick={onClose}>
          <X />
        </button>
      </div>
    </div>
  ) : null;
}