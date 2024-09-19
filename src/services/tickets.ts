import { DataSnapshot } from "firebase/database";
import ConfigureApp from "../config/config";
import { TicketType } from "../types/types";

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

export const put = (id: string, selectedSeat: number) => {};
