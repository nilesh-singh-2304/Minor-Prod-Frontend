import { create } from "zustand";

export const useWorkspaceStore = create((set, get) => ({
  openTabs: [],
  activeTabId: null,
  tabData: {},

  // 🔥 NEW: collections as source of truth
  collections: [
    {
      id: "1",
      name: "User API",
      requests: [
        { id: "1-1", name: "Get All Users", method: "GET" },
        { id: "1-2", name: "Create User", method: "POST" },
        { id: "1-3", name: "Update User", method: "PUT" },
        { id: "1-4", name: "Delete User", method: "DELETE" },
      ],
    },
    {
      id: "2",
      name: "Products API",
      requests: [
        { id: "2-1", name: "List Products", method: "GET" },
        { id: "2-2", name: "Add Product", method: "POST" },
      ],
    },
  ],

  openRequestTab: (request, collection) => {
    const { openTabs } = get();
    const tabId = request.id;

    const existingTab = openTabs.find((t) => t.id === tabId);

    if (existingTab) {
      set({ activeTabId: tabId });
      return;
    }

    const newTab = {
      id: tabId,
      name: request.name,
      method: request.method,
      collectionId: collection?.id,
    };

    set((state) => ({
      openTabs: [...state.openTabs, newTab],
      activeTabId: tabId,
      tabData: {
        ...state.tabData,
        [tabId]: {
          ...request,
          url: request.url || "",
          headers: request.headers || [],
          params: request.params || [],
          body: request.body || "",
        },
      },
    }));
  },

  closeTab: (tabId) => {
    set((state) => {
      const newTabs = state.openTabs.filter((t) => t.id !== tabId);

      let newActive = state.activeTabId;
      if (state.activeTabId === tabId) {
        newActive = newTabs.length ? newTabs[0].id : null;
      }

      const newTabData = { ...state.tabData };
      delete newTabData[tabId];

      return {
        openTabs: newTabs,
        activeTabId: newActive,
        tabData: newTabData,
      };
    });
  },

  switchTab: (tabId) => set({ activeTabId: tabId }),

  // 🔥 IMPORTANT: sync everywhere
  updateTabData: (tabId, updated) => {
    set((state) => ({
      // update request view
      tabData: {
        ...state.tabData,
        [tabId]: {
          ...state.tabData[tabId],
          ...updated,
        },
      },

      // update tab header
      openTabs: state.openTabs.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              name: updated.name || tab.name,
              method: updated.method || tab.method,
            }
          : tab
      ),

      // 🔥 update sidebar collections
      collections: state.collections.map((collection) => ({
        ...collection,
        requests: collection.requests.map((req) =>
          req.id === tabId ? { ...req, ...updated } : req
        ),
      })),
    }));
  },
}));