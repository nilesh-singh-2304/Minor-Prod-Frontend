import { useState , useEffect } from "react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Plus, FolderOpen, ArrowLeft, Globe, Send } from "lucide-react"
import { cn } from "../../lib/utils"
import { useWorkspaceStore } from "../../store/useWorkspaceStore";


const initialCollections = [
  {
    id: '1',
    name: 'User API',
    baseUrl: 'https://api.example.com/v1',
    requests: [
      { id: '1', name: 'Get All Users', method: 'GET' },
      { id: '2', name: 'Create User', method: 'POST' },
      { id: '3', name: 'Update User', method: 'PUT' },
      { id: '4', name: 'Delete User', method: 'DELETE' },
    ]
  },
  {
    id: '2',
    name: 'Products API',
    baseUrl: 'https://api.shop.com/v2',
    requests: [
      { id: '1', name: 'List Products', method: 'GET' },
      { id: '2', name: 'Add Product', method: 'POST' },
    ]
  },
  {
    id: '3',
    name: 'Auth Service',
    baseUrl: 'https://auth.myapp.io',
    requests: [
      { id: '1', name: 'Login', method: 'POST' },
      { id: '2', name: 'Register', method: 'POST' },
      { id: '3', name: 'Refresh Token', method: 'POST' },
    ]
  },
]

const methodColors = {
  GET: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
  POST: 'bg-blue-500/15 text-blue-600 border-blue-500/30',
  PUT: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
  DELETE: 'bg-red-500/15 text-red-600 border-red-500/30',
  PATCH: 'bg-purple-500/15 text-purple-600 border-purple-500/30',
}

function MethodBadge({ method }) {
  return (
    <span className={cn(
      "px-2 py-0.5 text-xs font-semibold rounded border",
      methodColors[method] || 'bg-muted text-muted-foreground'
    )}>
      {method}
    </span>
  )
}

function AddRequestDialog({ onAddRequest }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [method, setMethod] = useState('GET')

  const handleCreate = () => {
    if (name.trim()) {
      onAddRequest({
        id: Date.now().toString(),
        name: name.trim(),
        method,
      })
      setName('')
      setMethod('GET')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="min-h-[36px] sm:min-h-0">
          <Plus className="w-4 h-4 mr-1.5" />
          <span className="hidden sm:inline">Add Request</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle>Add New Request</DialogTitle>
          <DialogDescription>
            Create a new API request in this collection.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Request Name</label>
            <Input 
              placeholder="Get User by ID" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-[44px] sm:min-h-0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">HTTP Method</label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="min-h-[44px] sm:min-h-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="min-h-[44px] sm:min-h-0 w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleCreate} className="min-h-[44px] sm:min-h-0 w-full sm:w-auto">
            Add Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CreateCollectionDialog({ onCreateCollection }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [baseUrl, setBaseUrl] = useState('')

  const handleCreate = () => {
    if (name.trim()) {
      onCreateCollection({
        id: Date.now().toString(),
        name: name.trim(),
        baseUrl: baseUrl.trim() || 'https://api.example.com',
        requests: []
      })
      setName('')
      setBaseUrl('')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="min-h-[44px] sm:min-h-0">
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Create Collection</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription>
            Add a new collection to organize your API requests.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input 
              placeholder="My Collection" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-[44px] sm:min-h-0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Base URL</label>
            <Input 
              placeholder="https://api.example.com" 
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="min-h-[44px] sm:min-h-0"
            />
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="min-h-[44px] sm:min-h-0 w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleCreate} className="min-h-[44px] sm:min-h-0 w-full sm:w-auto">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CollectionsList({ collections, onSelectCollection, onCreateCollection }) {
  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Your Collections</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
            {collections.length} collection{collections.length !== 1 ? 's' : ''}
          </p>
        </div>
        <CreateCollectionDialog onCreateCollection={onCreateCollection} />
      </div>

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
          <FolderOpen className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/30 mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">No collections yet</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4">
            Create your first collection to organize API requests
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {collections.map((collection) => (
            <Card 
              key={collection.id}
              className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200 active:scale-[0.99]"
              onClick={() => onSelectCollection(collection)}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate text-sm sm:text-base">{collection.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                      <Globe className="w-3 h-3 shrink-0" />
                      <span className="truncate">{collection.baseUrl}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                      <Send className="w-3 h-3 shrink-0" />
                      <span>{collection.requests.length} request{collection.requests.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function CollectionDetail({ collection, onBack, onSelectRequest, onAddRequest }) {
  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3 sm:mb-4 min-h-[44px] sm:min-h-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collections
        </button>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground truncate">{collection.name}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">{collection.baseUrl}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-sm font-medium text-foreground">
            Requests ({collection.requests.length})
          </h3>
          <AddRequestDialog onAddRequest={onAddRequest} />
        </div>

        {collection.requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-center border border-dashed rounded-lg">
            <Send className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/30 mb-2 sm:mb-3" />
            <p className="text-xs sm:text-sm text-muted-foreground">No requests in this collection</p>
          </div>
        ) : (
          <div className="border rounded-lg divide-y">
            {collection.requests.map((request) => (
              <div 
                key={request.id}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-muted/50 cursor-pointer transition-colors active:bg-muted/70"
                onClick={() => onSelectRequest(request)}
              >
                <MethodBadge method={request.method} />
                <span className="text-sm font-medium text-foreground truncate">{request.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function Collections({ onOpenRequest }) {
  const collections = useWorkspaceStore((s) => s.collections);
  const fetchCollections = useWorkspaceStore((s) => s.fetchCollections);
  const openRequestTab = useWorkspaceStore((s) => s.openRequestTab);
  const loading = useWorkspaceStore((s) => s.loading);

  const [selectedCollection, setSelectedCollection] = useState(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleSelectRequest = (request) => {
    openRequestTab(request, selectedCollection);

    if (onOpenRequest) {
      onOpenRequest(request, selectedCollection);
    }
  };

  // 🔥 LOADING UI
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading collections...
      </div>
    );
  }

  // 🔥 DETAIL VIEW
  if (selectedCollection) {
    return (
      <div className="flex-1 overflow-auto">
        <CollectionDetail
          collection={selectedCollection}
          onBack={() => setSelectedCollection(null)}
          onSelectRequest={handleSelectRequest}
          onAddRequest={() => {}}
        />
      </div>
    );
  }

  // 🔥 LIST VIEW
  return (
    <div className="flex-1 overflow-auto">
      <CollectionsList
        collections={collections}
        onSelectCollection={setSelectedCollection}
        onCreateCollection={() => {}}
      />
    </div>
  );
}