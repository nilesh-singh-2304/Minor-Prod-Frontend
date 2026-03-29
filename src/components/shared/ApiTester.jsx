import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '..//ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '..//ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Send, Plus, Trash2, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

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

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <Input
            placeholder={placeholder?.key || "Key"}
            value={item.key}
            onChange={(e) => updateItem(index, 'key', e.target.value)}
            className="flex-1 text-sm"
          />
          <Input
            placeholder={placeholder?.value || "Value"}
            value={item.value}
            onChange={(e) => updateItem(index, 'value', e.target.value)}
            className="flex-1 text-sm"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(index)}
            className="shrink-0 text-muted-foreground hover:text-destructive self-end sm:self-auto h-10 w-10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem} className="mt-2">
        <Plus className="w-4 h-4 mr-2" />
        Add Row
      </Button>
    </div>
  )
}

export function ApiTester() {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('')
  const [headers, setHeaders] = useState([{ key: 'Content-Type', value: 'application/json', enabled: true }])
  const [params, setParams] = useState([{ key: '', value: '', enabled: true }])
  const [body, setBody] = useState('{\n  \n}')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [responseHeaders, setResponseHeaders] = useState(null)
  const [responseTime, setResponseTime] = useState(null)

  const sendRequest = async () => {
    if (!url) return

    setLoading(true)
    setResponse(null)
    setResponseHeaders(null)

    const startTime = performance.now()

    try {
      // Build query string from params
      const queryParams = params
        .filter(p => p.key && p.enabled)
        .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
        .join('&')
      
      const fullUrl = queryParams ? `${url}?${queryParams}` : url

      // Build headers object
      const headersObj = {}
      headers.filter(h => h.key && h.enabled).forEach(h => {
        headersObj[h.key] = h.value
      })

      const options = {
        method,
        headers: headersObj,
      }

      if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
        options.body = body
      }

      const res = await fetch(fullUrl, options)
      const endTime = performance.now()
      setResponseTime(Math.round(endTime - startTime))

      // Get response headers
      const resHeaders = {}
      res.headers.forEach((value, key) => {
        resHeaders[key] = value
      })
      setResponseHeaders(resHeaders)

      // Try to parse as JSON, fallback to text
      const contentType = res.headers.get('content-type')
      let data
      if (contentType && contentType.includes('application/json')) {
        data = await res.json()
      } else {
        data = await res.text()
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        data,
        ok: res.ok,
      })
    } catch (error) {
      setResponse({
        status: 0,
        statusText: 'Error',
        data: { error: error.message },
        ok: false,
      })
      setResponseTime(Math.round(performance.now() - startTime))
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return statusColors.success
    if (status >= 400 && status < 500) return statusColors.warning
    return statusColors.error
  }

  return (
    <div className="flex h-full gap-3 sm:gap-4 p-3 sm:p-6 overflow-auto">
      {/* Request Panel */}
      <Card className="shrink-0">
        <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-sm sm:text-base">Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
          {/* URL Bar */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className={cn("w-full sm:w-28 font-medium", methodColors[method])}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(methodColors).map((m) => (
                  <SelectItem key={m} value={m} className="font-medium">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Enter request URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 font-mono text-sm"
              onKeyDown={(e) => e.key === 'Enter' && sendRequest()}
            />
            <Button 
              onClick={sendRequest} 
              disabled={loading || !url} 
              className="w-full sm:w-auto px-4 sm:px-6 min-h-[44px] sm:min-h-0"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send
            </Button>
          </div>

          {/* Request Tabs */}
          <Tabs defaultValue="params" className="w-full">
            <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:flex sm:max-w-md overflow-x-auto">
              <TabsTrigger value="params" className="text-xs sm:text-sm">Params</TabsTrigger>
              <TabsTrigger value="headers" className="text-xs sm:text-sm">Headers</TabsTrigger>
              <TabsTrigger value="body" className="text-xs sm:text-sm">Body</TabsTrigger>
            </TabsList>
            <TabsContent value="params" className="mt-3 sm:mt-4">
              <div className="overflow-x-auto">
                <KeyValueEditor
                  items={params}
                  onChange={setParams}
                  placeholder={{ key: "Parameter name", value: "Parameter value" }}
                />
              </div>
            </TabsContent>
            <TabsContent value="headers" className="mt-3 sm:mt-4">
              <div className="overflow-x-auto">
                <KeyValueEditor
                  items={headers}
                  onChange={setHeaders}
                  placeholder={{ key: "Header name", value: "Header value" }}
                />
              </div>
            </TabsContent>
            <TabsContent value="body" className="mt-3 sm:mt-4">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{\n  "key": "value"\n}'
                className="w-full h-32 sm:h-40 p-3 sm:p-4 font-mono text-sm bg-muted/50 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Response Panel */}
      <Card className="flex-1 flex flex-col min-h-[250px] sm:min-h-0">
        <CardHeader className="pb-3 sm:pb-4 shrink-0 px-3 sm:px-6 pt-3 sm:pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-sm sm:text-base">Response</CardTitle>
            {response && (
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <Badge variant="outline" className={cn("font-mono text-xs", getStatusColor(response.status))}>
                  {response.status} {response.statusText}
                </Badge>
                {responseTime && (
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {responseTime}ms
                  </span>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 px-3 sm:px-6 pb-3 sm:pb-6">
          {!response && !loading && (
            <div className="h-full flex items-center justify-center text-muted-foreground min-h-[150px]">
              <div className="text-center">
                <Send className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-20" />
                <p className="text-sm sm:text-base">Send a request to see the response</p>
              </div>
            </div>
          )}
          
          {loading && (
            <div className="h-full flex items-center justify-center min-h-[150px]">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
            </div>
          )}

          {response && !loading && (
            <Tabs defaultValue="response" className="h-full flex flex-col">
              <TabsList className="w-fit shrink-0">
                <TabsTrigger value="response" className="text-xs sm:text-sm">Response</TabsTrigger>
                <TabsTrigger value="headers" className="text-xs sm:text-sm">Headers</TabsTrigger>
              </TabsList>
              <TabsContent value="response" className="flex-1 mt-3 sm:mt-4 min-h-0">
                <pre className="h-full p-3 sm:p-4 bg-muted/50 rounded-lg overflow-auto font-mono text-xs sm:text-sm break-words whitespace-pre-wrap">
                  {typeof response.data === 'object'
                    ? JSON.stringify(response.data, null, 2)
                    : response.data}
                </pre>
              </TabsContent>
              <TabsContent value="headers" className="flex-1 mt-3 sm:mt-4 min-h-0">
                <pre className="h-full p-3 sm:p-4 bg-muted/50 rounded-lg overflow-auto font-mono text-xs sm:text-sm break-words whitespace-pre-wrap">
                  {responseHeaders
                    ? JSON.stringify(responseHeaders, null, 2)
                    : 'No headers'}
                </pre>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
