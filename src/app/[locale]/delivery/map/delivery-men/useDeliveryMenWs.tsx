import { useEffect, useState } from 'react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

export default function useDeliveryMenWs() {
  const [positions, setPositions] = useState<any[]>([])

  useEffect(() => {
    console.log('Initializing WebSocket connection...')

    // Create the SockJS connection
    const socket = new SockJS('http://localhost:8080/ws') // WebSocket connection
    console.log('SockJS instance created:', socket)

    // Create and configure the STOMP client
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log('%cSTOMP DEBUG:', 'color: green;', str),
      reconnectDelay: 5000, // Auto-reconnect after 5 seconds
      onConnect: () => {
        console.log(
          '%cWebSocket connected successfully.',
          'color: blue; font-weight: bold;'
        )

        // Subscribe to the delivery topic
        stompClient.subscribe('/topic/delivery', (message) => {
          try {
            const data = JSON.parse(message.body)
            console.log('%cNew message received:', 'color: orange;', data)

            setPositions((prev) => {
              console.log('%cUpdating positions...', 'color: purple;', {
                prev,
                new: data,
              })
              return [
                ...prev.filter((p) => p.deliveryBoyId !== data.deliveryBoyId),
                data,
              ]
            })
          } catch (err) {
            console.error(
              '%cError parsing message:',
              'color: red;',
              err,
              message.body
            )
          }
        })
      },
      onStompError: (error) => {
        console.error('%cSTOMP error:', 'color: red; font-weight: bold;', error)
      },
      onWebSocketClose: (event) => {
        console.warn('%cWebSocket connection closed:', 'color: brown;', event)
      },
    })

    console.log('Activating STOMP client...')
    stompClient.activate()

    return () => {
      console.log('%cDeactivating STOMP client...', 'color: gray;')
      stompClient.deactivate()
    }
  }, [])

  return positions
}
