
import { useState } from 'react'
import { Zap, Send, FolderOpen, History, X, ChevronRight, Plus } from 'lucide-react'
import { cn } from '../../lib/utils'

const navItems = [
  { id: 'tester', label: 'API Tester', icon: Send },
  { id: 'collections', label: 'Collections', icon: FolderOpen },
  { id: 'history', label: 'History', icon: History },
]

const initialCollections = [
  {
    id: '1',
    name: 'User API',
    requests: [
      { id: '1-1', name: 'Get All Users', method: 'GET' },
      { id: '1-2', name: 'Create User', method: 'POST' },
      { id: '1-3', name: 'Update User', method: 'PUT' },
      { id: '1-4', name: 'Delete User', method: 'DELETE' },
    ]
  },
  {
    id: '2',
    name: 'Products API',
    requests: [
      { id: '2-1', name: 'List Products', method: 'GET' },
      { id: '2-2', name: 'Add Product', method: 'POST' },
    ]
  },
  {
    id: '3',
    name: 'Auth Service',
    requests: [
      { id: '3-1', name: 'Login', method: 'POST' },
      { id: '3-2', name: 'Register', method: 'POST' },
      { id: '3-3', name: 'Refresh Token', method: 'POST' },
    ]
  },
]

const methodColors = {
  GET: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  POST: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  PUT: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  DELETE: 'bg-red-500/15 text-red-600 dark:text-red-400',
  PATCH: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
}

function MethodBadge({ method }) {
  return (
    <span className={cn(
      "px-1.5 py-0.5 text-[10px] font-bold rounded shrink-0",
      methodColors[method] || 'bg-muted text-muted-foreground'
    )}>
      {method}
    </span>
  )
}

function CollectionItem({ collection, expandedCollections, onToggle, activeRequest, onRequestClick }) {
  const isExpanded = expandedCollections.includes(collection.id)
  
  return (
    <div>
      <button
        onClick={() => onToggle(collection.id)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <ChevronRight 
          className={cn(
            "w-4 h-4 shrink-0 transition-transform duration-200",
            isExpanded && "rotate-90"
          )} 
        />
        <FolderOpen className="w-4 h-4 shrink-0" />
        <span className="truncate flex-1 text-left">{collection.name}</span>
        <span className="text-xs text-muted-foreground/70 shrink-0">
          {collection.requests.length}
        </span>
      </button>
      
      {/* Requests List */}
      <div 
        className={cn(
          "overflow-hidden transition-all duration-200 ease-out",
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="ml-4 pl-3 border-l border-border/50 space-y-0.5 py-1">
          {collection.requests.map((request) => (
            <button
              key={request.id}
              onClick={() => onRequestClick(request, collection)}
              className={cn(
                "w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs transition-all duration-150",
                activeRequest?.id === request.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <MethodBadge method={request.method} />
              <span className="truncate flex-1 text-left">{request.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function SidebarContent({ activeItem, onItemClick, activeRequest, onRequestClick }) {
  const [expandedCollections, setExpandedCollections] = useState([])

  const toggleCollection = (collectionId) => {
    setExpandedCollections(prev => 
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    )
  }

  return (
    <>
      {/* Logo */}
      <div className="p-4 sm:p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-base sm:text-lg text-foreground">Frontend API</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
        {/* Main Nav Items */}
        <ul className="space-y-1 mb-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id && !activeRequest
            return (
              <li key={item.id}>
                <button
                  onClick={() => onItemClick(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>

        {/* Collections Section */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Collections
            </span>
            <button
              onClick={() => onItemClick('collections')}
              className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              title="Manage Collections"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-0.5">
            {initialCollections.map((collection) => (
              <CollectionItem
                key={collection.id}
                collection={collection}
                expandedCollections={expandedCollections}
                onToggle={toggleCollection}
                activeRequest={activeRequest}
                onRequestClick={onRequestClick}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">v1.0.0</p>
      </div>
    </>
  )
}

export function Sidebar({ activeItem, onItemClick, activeRequest, onRequestClick }) {
  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-full">
      <SidebarContent 
        activeItem={activeItem} 
        onItemClick={onItemClick}
        activeRequest={activeRequest}
        onRequestClick={onRequestClick}
      />
    </aside>
  )
}

export function MobileSidebar({ isOpen, onClose, activeItem, onItemClick, activeRequest, onRequestClick }) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full w-72 bg-card border-r border-border flex flex-col z-50 lg:hidden transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <SidebarContent 
          activeItem={activeItem} 
          onItemClick={onItemClick}
          activeRequest={activeRequest}
          onRequestClick={onRequestClick}
        />
      </aside>
    </>
  )
}
