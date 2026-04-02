import { useEffect, useState } from "react";
import { Sidebar, MobileSidebar } from "../components/shared/sidebar";
import { Header } from "../components/shared/Header";
import { Outlet, useLocation } from "react-router-dom";
import { useWorkspaceStore } from "../store/useWorkspaceStore";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();

  const activeTabId = useWorkspaceStore((state) => state.activeTabId);
  const openTabs = useWorkspaceStore((state) => state.openTabs);
  const fetchCollections = useWorkspaceStore((s) => s.fetchCollections);

  useEffect(() => {
    fetchCollections();
  },[]);

  const getHeaderInfo = () => {
    // 🧠 If inside workspace and tab is open
    if (location.pathname.startsWith("/workspace") && activeTabId) {
      const activeTab = openTabs.find((t) => t.id === activeTabId);

      return {
        item: "request",
        requestName: activeTab?.name || "Untitled Request",
      };
    }

    // 🧭 Route-based fallback
    if (location.pathname === "/") {
      return { item: "tester", requestName: null };
    }

    if (location.pathname.startsWith("/collections")) {
      return { item: "collections", requestName: null };
    }

    if (location.pathname.startsWith("/history")) {
      return { item: "history", requestName: null };
    }

    return { item: "tester", requestName: null };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeItem={headerInfo.item}
          requestName={headerInfo.requestName}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-hidden bg-muted/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
}