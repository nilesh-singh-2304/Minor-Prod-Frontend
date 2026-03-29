
import { useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

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

export function WorkspaceTabs({ tabs, activeTabId, onTabClick, onTabClose }) {
  const tabsContainerRef = useRef(null)
  const activeTabRef = useRef(null)

  // Scroll active tab into view when it changes
  useEffect(() => {
    if (activeTabRef.current && tabsContainerRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, [activeTabId])

  if (tabs.length === 0) {
    return null
  }

  return (
    <div className="bg-card border-b border-border">
      <div 
        ref={tabsContainerRef}
        className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
        style={{ scrollbarWidth: 'thin' }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId
          return (
            <div
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              className={cn(
                "group relative flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-r border-border min-w-[120px] sm:min-w-[160px] max-w-[200px] sm:max-w-[240px] cursor-pointer select-none transition-all duration-150",
                isActive 
                  ? "bg-background border-b-2 border-b-primary" 
                  : "bg-muted/30 hover:bg-muted/50 border-b-2 border-b-transparent"
              )}
              onClick={() => onTabClick(tab.id)}
            >
              <MethodBadge method={tab.method} />
              <span 
                className={cn(
                  "text-xs sm:text-sm truncate flex-1 transition-colors",
                  isActive ? "text-foreground font-medium" : "text-muted-foreground"
                )}
                title={tab.name}
              >
                {tab.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onTabClose(tab.id)
                }}
                className={cn(
                  "p-0.5 rounded hover:bg-muted-foreground/20 transition-all shrink-0",
                  "opacity-0 group-hover:opacity-100",
                  isActive && "opacity-60 group-hover:opacity-100"
                )}
                title="Close tab"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
