import WebSocket, { RawData } from "ws";
import Configuration from "../Config";
import { SeatType } from "../Types/types";
import { DataSnapshot } from "firebase/database";

interface ClientMessage {
  type: string;
  data: { itinID: string; selectedSeats: number[] };
}

const { fbConnector } = Configuration;
const clients = new Set<WebSocket>();

export function initWebSocketServer(wsServer: WebSocket.Server) {
  wsServer.on("connection", (ws) => {
    // console.log("WebSocket client connected");
    clients.add(ws);

    let seatsListenerUnsubscribe: (() => void) | null = null;
    let itinID: string | undefined;

    ws.on("message", async (message: RawData) => {
      const messageString = Buffer.isBuffer(message)
        ? message.toString()
        : message;

      try {
        const parsedMessage: ClientMessage = JSON.parse(
          messageString as string
        );

        if (parsedMessage.type === "SEND_ITIN_ID") {
          itinID = parsedMessage.data.itinID;
        }

        if (parsedMessage.type === "GET_SEATS_REAL_TIME" && itinID) {
          seatsListenerUnsubscribe = setupFirebaseListener(itinID);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    ws.on("close", () => {
      // console.log("WebSocket client disconnected");
      clients.delete(ws);

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

  const unsubscribe = fbConnector.setValueListener(
    path,
    (snapshot: DataSnapshot) => {
      const updatedData = snapshot.val();

      if (isFirstUpdate) {
        isFirstUpdate = false;
        return;
      }

      const message = JSON.stringify({
        type: "SEATS_UPDATE",
        data: updatedData,
      });

      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  );

  return unsubscribe;
};
