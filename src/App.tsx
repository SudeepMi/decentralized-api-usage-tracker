import React, { useState, useEffect } from 'react'
import { Key, Activity, Database, ExternalLink, Copy, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

// Configuration - replace with your Vercel Functions URL
const API_BASE_URL = 'https://decentralized-api-usage-tracker.vercel.app/api'

interface UsageData {
  totalUsage: number
  recentLogs: any[]
  apiKey: string
}

interface ApiResponse {
  success: boolean
  data?: any
  audit?: any
  error?: string
  message?: string
}

function App() {
  const [apiKey, setApiKey] = useState('')
  const [userId, setUserId] = useState('')
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('apiKey')
    const savedUserId = localStorage.getItem('userId')
    if (savedApiKey) setApiKey(savedApiKey)
    if (savedUserId) setUserId(savedUserId)
  }, [])

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('apiKey', apiKey)
      fetchUsageData()
    }
  }, [apiKey])

  const generateApiKey = async () => {
    if (!userId.trim()) {
      toast.error('Please enter a user ID')
      return
    }

    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/register`, {
        params: { userId: userId.trim() }
      })

      if (response.data.success) {
        setApiKey(response.data.apiKey)
        setUserId(response.data.userId)
        localStorage.setItem('userId', response.data.userId)
        toast.success('API key generated successfully!')
      } else {
        toast.error(response.data.message || 'Failed to generate API key')
      }
    } catch (error: any) {
      console.error('Error generating API key:', error)
      toast.error(error.response?.data?.message || 'Failed to generate API key')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsageData = async () => {
    if (!apiKey) return

    try {
      const response = await axios.get(`${API_BASE_URL}/usage`, {
        params: { key: apiKey }
      })

      if (response.data.success) {
        setUsageData(response.data.data)
      }
    } catch (error: any) {
      console.error('Error fetching usage data:', error)
      if (error.response?.status === 401) {
        setApiKey('')
        localStorage.removeItem('apiKey')
        toast.error('Invalid API key')
      }
    }
  }

  const copyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      toast.success('API key copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy API key')
    }
  }

  const testApiRequest = async () => {
    if (!apiKey) {
      toast.error('Please generate an API key first')
      return
    }

    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/proxy`, {
        params: {
          key: apiKey,
          endpoint: '/forecast',
          latitude: '52.52',
          longitude: '13.41',
          hourly: 'temperature_2m',
          tag: 'weather:v1'
        }
      })

      if (response.data.success) {
        toast.success('API request successful! Check blockchain for verification.')
        fetchUsageData() // Refresh usage data
      } else {
        toast.error(response.data.message || 'API request failed')
      }
    } catch (error: any) {
      console.error('Error making API request:', error)
      toast.error(error.response?.data?.message || 'API request failed')
    } finally {
      setLoading(false)
    }
  }

  const openBlockchainExplorer = (txHash: string) => {
    window.open(`https://sepolia.etherscan.io/tx/${txHash}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📡 API Usage Tracker
          </h1>
          <p className="text-gray-600">
            Track API usage with MongoDB and Sepolia blockchain verification
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - API Key Management */}
          <div className="space-y-6">
            {/* Generate API Key */}
            <div className="card">
              <div className="flex items-center mb-4">
                <Key className="w-5 h-5 text-primary-600 mr-2" />
                <h2 className="text-xl font-semibold">Generate API Key</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User ID
                  </label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter your user ID"
                    className="input-field"
                  />
                </div>
                
                <button
                  onClick={generateApiKey}
                  disabled={loading || !userId.trim()}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Generate API Key'}
                </button>
              </div>
            </div>

            {/* API Key Display */}
            {apiKey && (
              <div className="card">
                <div className="flex items-center mb-4">
                  <Key className="w-5 h-5 text-green-600 mr-2" />
                  <h2 className="text-xl font-semibold">Your API Key</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm break-all">
                    {apiKey}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={copyApiKey}
                      className="btn-secondary flex-1 flex items-center justify-center"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={testApiRequest}
                      disabled={loading}
                      className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Testing...' : 'Test Request'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Usage Statistics */}
          <div className="space-y-6">
            {/* Usage Overview */}
            <div className="card">
              <div className="flex items-center mb-4">
                <Activity className="w-5 h-5 text-primary-600 mr-2" />
                <h2 className="text-xl font-semibold">Usage Statistics</h2>
              </div>
              
              {usageData ? (
                <div className="space-y-4">
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">
                      {usageData.totalUsage}
                    </div>
                    <div className="text-sm text-gray-600">Total API Calls</div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    API Key: {usageData.apiKey}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  Generate an API key to see usage statistics
                </div>
              )}
            </div>

            {/* Recent Activity */}
            {usageData && usageData.recentLogs.length > 0 && (
              <div className="card">
                <div className="flex items-center mb-4">
                  <Database className="w-5 h-5 text-primary-600 mr-2" />
                  <h2 className="text-xl font-semibold">Recent Activity</h2>
                </div>
                
                <div className="space-y-3">
                  {usageData.recentLogs.slice(0, 5).map((log, index) => (
                    <div key={index} className="border-l-4 border-primary-500 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">
                            {log.method} {log.endpoint}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(log.createdAt?.toDate?.() || log.createdAt).toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            log.status >= 200 && log.status < 300 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {log.status}
                          </span>
                          
                          {log.txHash && (
                            <button
                              onClick={() => openBlockchainExplorer(log.txHash)}
                              className="text-primary-600 hover:text-primary-700"
                              title="View on blockchain"
                            >
                              <span className="sr-only">View on blockchain</span>
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Built with React, Vercel Functions, and Solidity
          </p>
          <p className="mt-2">
            All API usage is logged to both MongoDB and the Sepolia blockchain for transparency
          </p>
          <p className="mt-2">
            <a 
              href="https://github.com/SudeepMi/decentralized-api-usage-tracker" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              📁 View on GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App 