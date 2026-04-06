import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import {
  Send,
  Plus,
  Trash2,
  Loader2,
  Save,
  Copy,
  Check,
  FileJson,
  Code,
  AlignLeft,
} from "lucide-react"
import { cn } from "../../lib/utils"
import { executeRequest } from "../../features/executor"
import JsonView from '@uiw/react-json-view';
import JsonViewEditor from '@uiw/react-json-view/editor';
import { lightTheme } from '@uiw/react-json-view/light';
import { darkTheme } from '@uiw/react-json-view/dark';
import { TriangleArrow } from '@uiw/react-json-view/triangle-arrow';
import { TriangleSolidArrow } from '@uiw/react-json-view/triangle-solid-arrow';
import { nordTheme } from '@uiw/react-json-view/nord';
import { githubLightTheme } from '@uiw/react-json-view/githubLight';
import { githubDarkTheme } from '@uiw/react-json-view/githubDark';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import { gruvboxTheme } from '@uiw/react-json-view/gruvbox';
import { monokaiTheme } from '@uiw/react-json-view/monokai';
import { basicTheme } from '@uiw/react-json-view/basic';

const methodColors = {
  GET: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  POST: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  PUT: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  DELETE: 'bg-red-500/10 text-red-600 border-red-500/20',
  PATCH: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
}

const statusColors = {
  success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  error: 'bg-red-500/10 text-red-600 border-red-500/20',
  warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
}

function KeyValueEditor({ items, onChange, placeholder }) {
  const addItem = () => {
    onChange([...items, { key: '', value: '', enabled: true }])
  }

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const updateItem = (index, field, value) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    onChange(newItems)
  }

  const toggleItem = (index) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], enabled: !newItems[index].enabled }
    onChange(newItems)
  }

  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <div className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
          No items added yet
        </div>
      )}
      {items.map((item, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center group">
          <div className="flex items-center gap-2 sm:contents">
            <input
              type="checkbox"
              checked={item.enabled}
              onChange={() => toggleItem(index)}
              className="w-4 h-4 rounded border-border accent-primary shrink-0"
            />
            <Input
              placeholder={placeholder?.key || "Key"}
              value={item.key}
              onChange={(e) => updateItem(index, 'key', e.target.value)}
              className={cn("flex-1 font-mono text-sm", !item.enabled && "opacity-50")}
            />
          </div>
          <div className="flex items-center gap-2 pl-6 sm:pl-0 sm:contents">
            <Input
              placeholder={placeholder?.value || "Value"}
              value={item.value}
              onChange={(e) => updateItem(index, 'value', e.target.value)}
              className={cn("flex-1 font-mono text-sm", !item.enabled && "opacity-50")}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              className="shrink-0 text-muted-foreground hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100 transition-opacity h-10 w-10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem} className="mt-2">
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </div>
  )
}

function ResponseViewer({ response, responseHeaders, responseTime }) {
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState('pretty')

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return statusColors.success
    if (status >= 400 && status < 500) return statusColors.warning
    return statusColors.error
  }

  const getStatusLabel = (status) => {
    if (status >= 200 && status < 300) return 'Success'
    if (status >= 400 && status < 500) return 'Client Error'
    if (status >= 500) return 'Server Error'
    return 'Error'
  }

  const copyToClipboard = () => {
    const text = typeof response.data === 'object' 
      ? JSON.stringify(response.data, null, 2) 
      : response.data
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatResponseData = () => {
    if (typeof response.data === 'object') {
      if (viewMode === 'pretty') {
        return JSON.stringify(response.data, null, 2)
      }
      return JSON.stringify(response.data)
    }
    return response.data
  }

  const finalData = response.data;

  const getResponseSize = () => {
    const text = typeof response.data === 'object' 
      ? JSON.stringify(response.data) 
      : response.data
    const bytes = new Blob([text]).size
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="h-full flex flex-col">
      {/* Response Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-border">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Badge variant="outline" className={cn("font-mono text-xs px-2 py-1", getStatusColor(response.status))}>
            {response.status} {response.statusText}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {getStatusLabel(response.status)}
          </span>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Time: <span className="font-mono text-foreground">{responseTime}ms</span></span>
            <span className="text-border hidden sm:inline">|</span>
            <span className="hidden sm:inline">Size: <span className="font-mono text-foreground">{getResponseSize()}</span></span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={copyToClipboard}
            className="h-8"
          >
            {copied ? (
              <Check className="w-4 h-4 mr-1.5 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4 mr-1.5" />
            )}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </Button>
        </div>
      </div>

      {/* Response Tabs */}
      <Tabs defaultValue="body" className="flex-1 flex flex-col mt-3 sm:mt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <TabsList className="h-9">
            <TabsTrigger value="body" className="text-xs">Body</TabsTrigger>
            <TabsTrigger value="headers" className="text-xs">
              Headers
              {responseHeaders && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-muted rounded">
                  {Object.keys(responseHeaders).length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('pretty')}
              className={cn(
                "p-1.5 rounded transition-colors",
                viewMode === 'pretty' ? "bg-background shadow-sm" : "hover:bg-background/50"
              )}
              title="Pretty"
            >
              <FileJson className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={cn(
                "p-1.5 rounded transition-colors",
                viewMode === 'raw' ? "bg-background shadow-sm" : "hover:bg-background/50"
              )}
              title="Raw"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>
        </div>

        <TabsContent value="body" className="flex-1 mt-3 sm:mt-4 min-h-0">
  <div className="h-80 overflow-auto rounded-xl border border-border">
    <JsonView value={response.data} style={nordTheme} />
  </div>
</TabsContent>

        <TabsContent value="headers" className="flex-1 mt-3 sm:mt-4 min-h-0">
          <div className="h-full overflow-auto">
            {responseHeaders && Object.keys(responseHeaders).length > 0 ? (
              <div className="space-y-1">
                {Object.entries(responseHeaders).map(([key, value]) => (
                  <div key={key} className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-2 px-2 sm:px-3 hover:bg-muted/50 rounded-lg">
                    <span className="font-mono text-xs sm:text-sm font-medium text-primary sm:min-w-[200px]">{key}</span>
                    <span className="font-mono text-xs sm:text-sm text-muted-foreground break-all">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p className="text-sm">No headers</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function RequestView({ request, onSave, onBack }) {
  const [requestName, setRequestName] = useState(request?.name || 'New Request')
  const [method, setMethod] = useState(request?.method || 'GET')
  const [url, setUrl] = useState(request?.url || '')
  const [baseUrl , setBaseUrl] = useState(request?.baseUrl || "");
  const [headers, setHeaders] = useState(request?.headers || [
    { key: 'Content-Type', value: 'application/json', enabled: true }
  ])
  const [params, setParams] = useState(request?.params || [])
  const [body, setBody] = useState('{\n  \n}')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [responseHeaders, setResponseHeaders] = useState(null)
  const [responseTime, setResponseTime] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)

  const markChanged = () => {
    if (!hasChanges) setHasChanges(true)
  }

 const sendRequest = async () => {
   if (!url) return;

   console.log("base url is : " , baseUrl);
   
 
   setLoading(true);
   setResponse(null);
   setResponseHeaders(null);
   const fullUrl = baseUrl+url;
 
   const result = await executeRequest({
     url: fullUrl,
     method,
     headers,
     params,
     body,
   });
 
   setResponse(result.response);
   setResponseHeaders(result.headers);
   setResponseTime(result.time);
 
   setLoading(false);
 };
 
  const handleSave = () => {
    if (onSave) {
      onSave({
        ...request,
        name: requestName,
        method,
        url,
        headers,
        params,
        body,
      })
      setHasChanges(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Left Panel - Request Configuration */}
      <div className="lg:w-1/2 border-b lg:border-b-0 lg:border-r border-border flex flex-col min-h-[50vh] lg:min-h-0">
        <div className="p-3 sm:p-4 border-b border-border">
          {/* Request Name */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Input
              value={requestName}
              onChange={(e) => {
                setRequestName(e.target.value)
                markChanged()
              }}
              className="text-base sm:text-lg font-semibold border-none shadow-none px-0 h-auto focus-visible:ring-0"
              placeholder="Request name"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges}
              className={cn("shrink-0 min-h-[44px] sm:min-h-0", hasChanges && "border-primary text-primary")}
            >
              <Save className="w-4 h-4 mr-1.5" />
              Save
            </Button>
          </div>

          {/* Method + URL Bar */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={method} onValueChange={(v) => { setMethod(v); markChanged() }}>
              <SelectTrigger className={cn("w-full sm:w-28 font-semibold", methodColors[method])}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(methodColors).map((m) => (
                  <SelectItem key={m} value={m} className="font-semibold">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center border w-full rounded px-2">
  <span className="text-gray-500 text-sm">
    {"{base}"}
  </span>

  <Input
    placeholder="Enter Request URL"
    value={url}
    onChange={(e) => {
      setUrl(e.target.value);
      markChanged();
    }}
    className="flex-1 font-mono text-sm border-none focus:ring-0"
    onKeyDown={(e) => e.key === "Enter" && sendRequest()}
  />
</div>
            <Button 
              onClick={sendRequest} 
              disabled={loading || !url}
              className="px-4 sm:px-5 min-h-[44px] sm:min-h-0"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="ml-2 sm:hidden">Send</span>
            </Button>
          </div>
        </div>

        {/* Request Configuration Tabs */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="params" className="h-full flex flex-col">
            <div className="px-3 sm:px-4 pt-3 sm:pt-4 overflow-x-auto">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="params" className="text-xs">
                  Params
                  {params.filter(p => p.enabled && p.key).length > 0 && (
                    <span className="ml-1 sm:ml-1.5 px-1 sm:px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded">
                      {params.filter(p => p.enabled && p.key).length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="headers" className="text-xs">
                  Headers
                  {headers.filter(h => h.enabled && h.key).length > 0 && (
                    <span className="ml-1 sm:ml-1.5 px-1 sm:px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded">
                      {headers.filter(h => h.enabled && h.key).length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="body" className="text-xs">Body</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="params" className="flex-1 overflow-auto px-3 sm:px-4 pb-3 sm:pb-4 mt-3 sm:mt-4">
              <KeyValueEditor
                items={params}
                onChange={(v) => { setParams(v); markChanged() }}
                placeholder={{ key: "Parameter", value: "Value" }}
              />
            </TabsContent>

            <TabsContent value="headers" className="flex-1 overflow-auto px-3 sm:px-4 pb-3 sm:pb-4 mt-3 sm:mt-4">
              <KeyValueEditor
                items={headers}
                onChange={(v) => { setHeaders(v); markChanged() }}
                placeholder={{ key: "Header", value: "Value" }}
              />
            </TabsContent>

            <TabsContent value="body" className="flex-1 overflow-hidden px-3 sm:px-4 pb-3 sm:pb-4 mt-3 sm:mt-4">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">JSON Body</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => {
                      try {
                        const formatted = JSON.stringify(JSON.parse(body), null, 2)
                        setBody(formatted)
                      } catch (e) {
                        // Invalid JSON, don't format
                      }
                    }}
                  >
                    <AlignLeft className="w-3 h-3 mr-1.5" />
                    Format
                  </Button>
                </div>
                <textarea
                  value={body}
                  onChange={(e) => { setBody(e.target.value); markChanged() }}
                  placeholder='{\n  "key": "value"\n}'
                  className="flex-1 w-full p-3 sm:p-4 font-mono text-sm bg-muted/30 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring min-h-[120px]"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Panel - Response */}
      <div className="lg:w-1/2 flex flex-col bg-muted/20 min-h-[50vh] lg:min-h-0">
        <div className="p-3 sm:p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Response</h3>
        </div>

        <div className="flex-1 overflow-hidden p-3 sm:p-4">
          {!response && !loading && (
            <div className="h-full flex items-center justify-center text-muted-foreground min-h-[150px]">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                  <Send className="w-5 h-5 sm:w-7 sm:h-7 opacity-30" />
                </div>
                <p className="text-sm font-medium mb-1">No response yet</p>
                <p className="text-xs">Send a request to see the response</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="h-full flex items-center justify-center min-h-[150px]">
              <div className="text-center">
                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Sending request...</p>
              </div>
            </div>
          )}

          {response && !loading && (
            <ResponseViewer 
              response={response}
              responseHeaders={responseHeaders}
              responseTime={responseTime}
            />
          )}
        </div>
      </div>
    </div>
  )
}
