// utils/connectWebSocket.ts
import { Client, Stomp } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export const connectWebSocket = (): Promise<Client> => {
  return new Promise((resolve, reject) => {
    const socket = new SockJS('http://localhost:8080/ws')
    const stompClient = Stomp.over(socket)

    stompClient.debug = () => {}

    stompClient.connect(
      {},
      (frame: string) => {
        console.log('Connected: ' + frame)

        // Subscribe to a topic
        stompClient.subscribe('/topic/delivery', (message: any) => {
          console.log('Received: ' + message.body)
        })

        resolve(stompClient)
      },
      (error: string) => {
        console.error('STOMP error: ' + error)
        reject(error)
      }
    )
  })
}
