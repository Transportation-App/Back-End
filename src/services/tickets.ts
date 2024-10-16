import { DataSnapshot } from "firebase/database";
import ConfigureApp from "../config/config";
import { BusType, SeatType, TicketType } from "../types/types";

const { dbConnector } = ConfigureApp();

export const get = (id: string): Promise<TicketType | null> => {
  return new Promise((resolve, reject) => {
    dbConnector.read(
      "Ticket Service",
      id,
      (snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          resolve(null);
        }
      },
      (error: any) => {
        reject(error);
      }
    );
  });
};

export const put = (id: string, selectedSeats: number[], isRes: boolean): Promise<{expiryTime: number; updated: boolean} | null> => {
  return new Promise((resolve, reject) => {
    try {
      const currentTime = Date.now();
      const expiryTime = currentTime + 8 * 60 * 1000;

      const seatUpdates = selectedSeats.reduce((acc, seat) => {
        acc[seat - 1] = {
          isRes: isRes,
          number: seat - 1,
          expiredAt: expiryTime,
        };
        return acc;
      }, {} as Record<number, any>);

      dbConnector.update(`Ticket Service/${id}/bus/seats`, seatUpdates)
        .then(() => {
          resolve({expiryTime: expiryTime, updated: true});
        })
        .catch((error) => {
          console.error('Error updating seats:', error);
          reject(null);
        });
    } catch (error) {
      console.error('Error in seat update process:', error);
      reject(null);
    }
  });
};

export const getExpiryTime = (itinID: string, seat: string): Promise<SeatType | null> => {
  return new Promise((resolve, reject) => {
    dbConnector.read(
      `Ticket Service/${itinID}/bus/seats`, 
      seat, 
      (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        resolve(snapshot.val());
      } else {
        resolve(null);
      }
    },
    (error: any) => {
      reject(error);
    })
  })
}

// export const getOnValueSeats = (itinID: string): Promise<BusType | null> => {
//   new Promise((resolve, reject) => {

//   })
// }