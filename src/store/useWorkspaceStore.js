import { create } from "zustand";
import { GET_COLLECTIONS } from "../api/collectionApi";

export const useWorkspaceStore = create((set, get) => ({
  openTabs: [],
  activeTabId: null,
  tabData: {},

  collections: [],
  loading: false,
  error: null,

  fetchCollections: async()=>{
    if(get().collections.lenght > 0) return;

    set({loading: true , error: null});
    try {
        const response = await fetch(GET_COLLECTIONS , {
            method: "GET",
            credentials: "include"
        });

        const res = await response.json();
        console.log(res);
        
        const data = res.data || [];

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
            }))
        }));

        set({
            collections: normalized,
            loading: false,
        });

    } catch (err) {
        set({
            error: err.message,
            loading: false,
        })
    }
  },

  // 🔥 NEW: collections as source of truth
//   collections: [
//     {
//       id: "1",
//       name: "User API",
//       requests: [
//         { id: "1-1", name: "Get All Users", method: "GET" },
//         { id: "1-2", name: "Create User", method: "POST" },
//         { id: "1-3", name: "Update User", method: "PUT" },
//         { id: "1-4", name: "Delete User", method: "DELETE" },
//       ],
//     },
//     {
//       id: "2",
//       name: "Products API",
//       requests: [
//         { id: "2-1", name: "List Products", method: "GET" },
//         { id: "2-2", name: "Add Product", method: "POST" },
//       ],
//     },
//   ],

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



function mapToArray(obj = {}){
    return Object.entries(obj || {}).map(([Key,value]) => ({
        key,
        value,
        enabled: true,
    }));
}

function normalizeBody(body) {
    if(!body) return {mode:"json" , content:""};

    if(typeof body == "string"){
        return {mode: "raw" , content:body};
    }

    return{
        mode: "json",
        content: JSON.stringify(body , null , 2),
    };
}