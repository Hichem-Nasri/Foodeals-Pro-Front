'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  // Removed unused import
} from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { getAccessToken } from '@/actions'
// Removed unused import

type WebSocketContextType = {
  stompClient: Client | null
  isConnected: boolean
  subscribe: <T>(
    destination: string,
    callback: (message: T) => void
  ) => () => void
  sendMessage: <T>(destination: string, body: T) => void
}

const WebSocketContext = createContext<WebSocketContextType>({
  stompClient: null,
  isConnected: false,
  subscribe: () => () => {},
  sendMessage: () => {},
})

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [stompClient, setStompClient] = useState<Client | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<Error | null>(null)
  const [reconnectAttempt, setReconnectAttempt] = useState(0)
  const [subscriptions, setSubscriptions] = useState<
    Map<string, ((message: any) => void)[]>
  >(new Map())
  const [token, setToken] = useState('')

  const handleMessage = useCallback(
    (destination: string, message: any) => {
      const callbacks = subscriptions.get(destination) || []
      callbacks.forEach((cb) => cb(JSON.parse(message.body)))
    },
    [subscriptions]
  )

  const subscribe = useCallback(
    <T,>(destination: string, callback: (message: T) => void) => {
      if (!stompClient || !stompClient.connected) {
        console.error('STOMP client is not connected')
        return () => {}
      }
      console.log('handle message from', destination)
      const sub = stompClient.subscribe(destination, (message) => {
        handleMessage(destination, message)
        console.log('received message from', destination)
      })

      setSubscriptions((prev) => {
        const newSubs = new Map(prev)
        const existing = newSubs.get(destination) || []
        newSubs.set(destination, [...existing, callback])
        return newSubs
      })

      return () => {
        sub.unsubscribe()
        setSubscriptions((prev) => {
          const newSubs = new Map(prev)
          const filtered =
            newSubs.get(destination)?.filter((cb) => cb !== callback) || []
          if (filtered.length === 0) {
            newSubs.delete(destination)
          } else {
            newSubs.set(destination, filtered)
          }
          return newSubs
        })
      }
    },
    [stompClient, handleMessage]
  )

  const sendMessage = useCallback(
    <T,>(destination: string, body: T) => {
      // if (!stompClient || !stompClient.connected) {
      //   console.error('STOMP client is not connected')
      //   return
      // }c
      console.log('send message to -----------------> ', destination)
      stompClient?.publish({
        destination,
        body: JSON.stringify(body),
      })
    },
    [stompClient]
  )

  useEffect(() => {
    getAccessToken().then((token) => {
      setToken(token || '')
    })
  }, [])

  // Initialize WebSocket connection once
  useEffect(() => {
    if (typeof window === 'undefined' || token === '') return

    let reconnectTimeout: NodeJS.Timeout | null = null
    console.log('token: ', token)
    const connectWebSocket = () => {
      try {
        setConnectionError(null)

        const socket = new SockJS('http://localhost:8080/ws', {
          transportOptions: {
            'xhr-streaming': {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          },
        })
        const client = new Client({
          webSocketFactory: () => socket,
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: () => {
            setIsConnected(true)
            setReconnectAttempt(0)
            console.log('Connected to WebSocket')
          },
          onWebSocketError: (event) => {
            const error = new Error(
              `WebSocket connection failed: ${event.toString()}`
            )
            console.error(error)
            setConnectionError(error)
            setIsConnected(false)

            // Implement exponential backoff for reconnection
            const delay = Math.min(30000, 1000 * Math.pow(2, reconnectAttempt))
            console.log(`Will attempt reconnection in ${delay / 1000}s`)

            if (reconnectTimeout) clearTimeout(reconnectTimeout)
            reconnectTimeout = setTimeout(() => {
              setReconnectAttempt((prev) => prev + 1)
              connectWebSocket()
            }, delay)
          },
          onDisconnect: () => {
            console.log('Disconnected from WebSocket')
            setIsConnected(false)
          },
          beforeConnect() {
            console.log('Connecting to WebSocket....')
          },
        })

        client.activate()
        setStompClient(client)

        return client
      } catch (error) {
        console.error('Failed to initialize WebSocket client:', error)
        setConnectionError(
          error instanceof Error ? error : new Error(String(error))
        )
        return null
      }
    }

    const client = connectWebSocket()

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
      if (client) {
        client.deactivate()
        setStompClient(null)
      }
    }
  }, [token])

  // Handle subscription changes separately
  useEffect(() => {
    if (!stompClient || !isConnected) return

    // Re-subscribe to all destinations when connection is established
    const activeSubscriptions = new Map()

    subscriptions.forEach((callbacks, destination) => {
      if (!activeSubscriptions.has(destination)) {
        stompClient.subscribe(destination, (message) =>
          handleMessage(destination, message)
        )
        activeSubscriptions.set(destination, true)
      }
    })
  }, [stompClient, isConnected, subscriptions, handleMessage])

  return (
    <WebSocketContext.Provider
      value={{ stompClient, isConnected, subscribe, sendMessage }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => useContext(WebSocketContext)
