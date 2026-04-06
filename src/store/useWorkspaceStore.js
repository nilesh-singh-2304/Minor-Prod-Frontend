import { create } from "zustand";
import { GET_COLLECTIONS } from "../api/collectionApi";

export const useWorkspaceStore = create((set, get) => ({
  openTabs: [],
  activeTabId: null,
  tabData: {},

  collections: [],
  loading: false,
  error: null,

  // 🔥 FETCH COLLECTIONS
  fetchCollections: async () => {
    if (get().collections.length > 0) return;

    set({ loading: true, error: null });

    try {
      const response = await fetch(GET_COLLECTIONS, {
        method: "GET",
        credentials: "include",
      });

      const res = await response.json();

      const data = res.data || [];

      console.log("response is : " , res);
      

      const normalized = data.map((col) => ({
        id: col._id,
        name: col.name,
        baseUrl: col.baseUrl,

        requests: (col.requests || []).map((req) => ({
          id: req._id,
          name: req.name,
          method: req.method,
          url: req.url || "",
          headers: mapToArray(req.headers),
          params: mapToArray(req.queryParams),
          body: normalizeBody(req.body),
        })),
      }));

      set({
        collections: normalized,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.message,
        loading: false,
      });
    }
  },

  // 🔥 OPEN TAB
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
          baseUrl: collection?.baseUrl || "",
          url: request.url || "",
          headers: request.headers || [],
          params: request.params || [],
          body: request.body || { mode: "json", content: "" },
        },
      },
    }));
  },

  // 🔥 CLOSE TAB
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

  // 🔥 UPDATE TAB DATA (SYNC EVERYWHERE)
  updateTabData: (tabId, updated) => {
    set((state) => ({
      tabData: {
        ...state.tabData,
        [tabId]: {
          ...state.tabData[tabId],
          ...updated,
        },
      },

      openTabs: state.openTabs.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              name: updated.name || tab.name,
              method: updated.method || tab.method,
            }
          : tab
      ),

      collections: state.collections.map((collection) => ({
        ...collection,
        requests: collection.requests.map((req) =>
          req.id === tabId ? { ...req, ...updated } : req
        ),
      })),
    }));
  },

  addCollection: ({id , name , baseUrl}) => {
    console.log("id is : " , id);
    console.log("name is : " , name);
    console.log("baseurl is : " , baseUrl);
    
    
    
    const newCollection = {
      id: id,
      name: name,
      baseUrl: baseUrl,
      requests: [],
    }

    set((state) => ({
        collections: [...state.collections, newCollection]
      }))
  },

  addRequest: ({collId , id , name , url , method}) => {
    set((state) => ({
      collections: state.collections.map((collection) => {
        if(collection.id != collId) return collection;

        return {
          ...collection,
          requests: [
            ...collection.requests,
            {
              id: id,
              name: name,
              method: method,
              url: url,
              headers: [],
              params: [],
              body: { mode: "json", content: "" },
            }
          ]
        }
      })
    }))
  },
}));

// 🔧 HELPERS

function mapToArray(obj = {}) {
  return Object.entries(obj || {}).map(([key, value]) => ({
    key,
    value,
    enabled: true,
  }));
}

function normalizeBody(body) {
  if (!body) return { mode: "json", content: "" };

  if (typeof body === "string") {
    return { mode: "raw", content: body };
  }

  return {
    mode: "json",
    content: JSON.stringify(body, null, 2),
  };
}