import WebSocket, { RawData } from 'ws';
import ConfigureApp from '../config/config';
import { getExpiryTime } from '../services/tickets';
import { SeatType } from '../types/types';
import { DataSnapshot } from 'firebase/database';

interface ClientMessage {
  type: string; 
  data: {itinID: string, selectedSeats: number[]} 
}

const {dbConnector} = ConfigureApp()
const clients = new Set<WebSocket>();

export function initWebSocketServer(wsServer: WebSocket.Server) {
  wsServer.on('connection', (ws) => {
    console.log('WebSocket client connected');
    clients.add(ws); 

    let seatsListenerUnsubscribe: (() => void) | null = null;

    
    ws.on('message', async (message: RawData) => {
      const messageString = Buffer.isBuffer(message) ? message.toString() : message;

      try {
        const parsedMessage: ClientMessage = JSON.parse(messageString as string);
        
        if (parsedMessage.type === 'GET_EXPIRY_TIME') {
          const seat: SeatType | null = await getExpiryTime(parsedMessage.data.itinID, parsedMessage.data.selectedSeats[0].toString())
          
          ws.send(JSON.stringify({ expiryTime: seat?.expiredAt }));
        }
        else if (parsedMessage.type === "GET_SEATS_REAL_TIME") {
          setupFirebaseListener(parsedMessage.data.itinID);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    
    ws.on('close', () => {
      console.log('WebSocket client disconnected'); 
      clients.delete(ws)

      if (seatsListenerUnsubscribe) {
        seatsListenerUnsubscribe(); 
        seatsListenerUnsubscribe = null; 
      }    
    });
  });
}

const setupFirebaseListener = (itinID: string) => {
  const path = `Ticket Service/${itinID}/bus/seats`; 
  let isFirstUpdate = true; 

  const unsubscribe = dbConnector.setValueListener(path, (snapshot: DataSnapshot) => {
    const updatedData = snapshot.val();

    if (isFirstUpdate) {
      isFirstUpdate = false; 
      return; 
    }

    const message = JSON.stringify({
      type: 'SEATS_UPDATE',
      data: updatedData,
    });
    
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  return unsubscribe;
}

