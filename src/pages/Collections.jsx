import { Collections as CollectionsComp } from "../components/shared/Collections";
import { useWorkspaceStore } from "../store/useWorkspaceStore";

export default function Collections() {
  const openRequestTab = useWorkspaceStore(state => state.openRequestTab);

  return <CollectionsComp onOpenRequest={openRequestTab} />;
}