import { useState, useCallback } from 'react'
import { Sidebar, MobileSidebar } from '../components/shared/sidebar'
import { Header } from '../components/shared/Header'
import { ApiTester } from '../components/shared/ApiTester'
import { Collections } from '../components/shared/Collections'
import { RequestView } from '../components/shared/RequestView'
import { WorkspaceTabs } from '../components/shared/WorkspaceTab'
import { History } from 'lucide-react'
import ThemeToggle from '../utils/ThemeToggel'

function HistoryPage() {
  return (
    <div className="flex-1 flex items-center justify-center text-muted-foreground p-4">
      <div className="text-center">
        <History className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-20" />
        <h2 className="text-lg sm:text-xl font-semibold mb-2">History</h2>
        <p className="text-sm sm:text-base">View your recent API requests</p>
      </div>
    </div>
  )
}

export default function Home() {
  const [activeItem, setActiveItem] = useState('tester')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Tab management state
  const [openTabs, setOpenTabs] = useState([])
  const [activeTabId, setActiveTabId] = useState(null)
  
  // Track request data per tab
  const [tabData, setTabData] = useState({})

  // Open a request in a tab (or switch to existing tab)
  const openRequestTab = useCallback((request, collection) => {
    const tabId = request.id
    
    // Check if tab already exists
    const existingTab = openTabs.find(tab => tab.id === tabId)
    
    if (existingTab) {
      // Switch to existing tab
      setActiveTabId(tabId)
    } else {
      // Create new tab
      const newTab = {
        id: tabId,
        name: request.name,
        method: request.method,
        collectionId: collection?.id,
        collectionName: collection?.name,
      }
      
      setOpenTabs(prev => [...prev, newTab])
      setActiveTabId(tabId)
      
      // Initialize tab data
      setTabData(prev => ({
        ...prev,
        [tabId]: {
          ...request,
          url: request.url || `https://api.example.com/${request.name.toLowerCase().replace(/\s+/g, '-')}`,
          headers: request.headers || [{ key: 'Content-Type', value: 'application/json', enabled: true }],
          params: request.params || [],
          body: request.body || '{\n  \n}',
        }
      }))
    }
    
    // Switch to workspace view
    setActiveItem('workspace')
    setSidebarOpen(false)
  }, [openTabs])

  // Close a tab
  const closeTab = useCallback((tabId) => {
    setOpenTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId)
      
      // If closing the active tab, switch to the next available tab or show tester
      if (activeTabId === tabId) {
        const closedIndex = prev.findIndex(tab => tab.id === tabId)
        if (newTabs.length > 0) {
          // Switch to the tab to the left, or the first tab if closing the first one
          const newActiveIndex = Math.min(closedIndex, newTabs.length - 1)
          setActiveTabId(newTabs[newActiveIndex].id)
        } else {
          setActiveTabId(null)
          setActiveItem('tester')
        }
      }
      
      return newTabs
    })
    
    // Clean up tab data
    setTabData(prev => {
      const newData = { ...prev }
      delete newData[tabId]
      return newData
    })
  }, [activeTabId])

  // Switch to a tab
  const switchTab = useCallback((tabId) => {
    setActiveTabId(tabId)
    setActiveItem('workspace')
  }, [])

  // Update tab data (when request is modified)
  const updateTabData = useCallback((tabId, updatedRequest) => {
    setTabData(prev => ({
      ...prev,
      [tabId]: { ...prev[tabId], ...updatedRequest }
    }))
    
    // Also update tab header info if name or method changed
    setOpenTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, name: updatedRequest.name, method: updatedRequest.method }
        : tab
    ))
  }, [])

  const renderContent = () => {
    // If we have open tabs and are in workspace view, show tabs + request view
    if (activeItem === 'workspace' && openTabs.length > 0 && activeTabId) {
      const currentTabData = tabData[activeTabId]
      return (
        <div className="flex-1 flex flex-col overflow-hidden">
          <WorkspaceTabs
            tabs={openTabs}
            activeTabId={activeTabId}
            onTabClick={switchTab}
            onTabClose={closeTab}
          />
          <div className="flex-1 overflow-hidden">
            {currentTabData && (
              <RequestView 
                key={activeTabId}
                request={currentTabData}
                onSave={(updatedRequest) => updateTabData(activeTabId, updatedRequest)}
              />
            )}
          </div>
        </div>
      )
    }

    switch (activeItem) {
      case 'tester':
        return <ApiTester />
      case 'collections':
        return <Collections onOpenRequest={openRequestTab} />
      case 'history':
        return <HistoryPage />
      case 'workspace':
        // No tabs open, show empty state
        return (
          <div className="flex-1 flex items-center justify-center text-muted-foreground p-4">
            <div className="text-center">
              <History className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-20" />
              <h2 className="text-lg sm:text-xl font-semibold mb-2">No requests open</h2>
              <p className="text-sm sm:text-base">Open a request from the sidebar or collections</p>
            </div>
          </div>
        )
      default:
        return <ApiTester />
    }
  }

  const handleItemClick = (item) => {
    setActiveItem(item)
    setSidebarOpen(false)
  }

  // Determine header title based on state
  const getHeaderInfo = () => {
    if (activeItem === 'workspace' && activeTabId && openTabs.length > 0) {
      const activeTab = openTabs.find(t => t.id === activeTabId)
      return { 
        item: 'request', 
        requestName: activeTab?.name 
      }
    }
    return { item: activeItem, requestName: null }
  }

  const headerInfo = getHeaderInfo()

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          activeItem={activeItem} 
          onItemClick={handleItemClick}
          activeRequest={activeTabId ? { id: activeTabId } : null}
          onRequestClick={openRequestTab}
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeItem={activeItem}
        onItemClick={handleItemClick}
        activeRequest={activeTabId ? { id: activeTabId } : null}
        onRequestClick={openRequestTab}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          activeItem={headerInfo.item}
          requestName={headerInfo.requestName}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-hidden bg-muted/30 flex flex-col">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
