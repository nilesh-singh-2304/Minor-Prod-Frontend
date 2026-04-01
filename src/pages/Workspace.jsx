import { WorkspaceTabs } from "../components/shared/WorkspaceTab";
import { RequestView } from "../components/shared/RequestView";
import { useWorkspaceStore } from "../store/useWorkspaceStore";

export default function Workspace() {
  const openTabs = useWorkspaceStore((s) => s.openTabs);
  const activeTabId = useWorkspaceStore((s) => s.activeTabId);
  const tabData = useWorkspaceStore((s) => s.tabData);

  const switchTab = useWorkspaceStore((s) => s.switchTab);
  const closeTab = useWorkspaceStore((s) => s.closeTab);
  const updateTabData = useWorkspaceStore((s) => s.updateTabData);

  if (!activeTabId) {
    return <div className="p-4 text-muted-foreground">No tabs open</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <WorkspaceTabs
        tabs={openTabs}
        activeTabId={activeTabId}
        onTabClick={switchTab}
        onTabClose={closeTab}
      />

      <RequestView
        key={activeTabId} // 🔥 important
        request={tabData[activeTabId]}
        onSave={(data) => updateTabData(activeTabId, data)}
      />
    </div>
  );
}