import { DataSnapshot } from "firebase/database";
import ConfigureApp from "../config/config";
import {
  BusType,
  paymentInfo,
  SeatFormData,
  SeatType,
  TicketType,
} from "../types/types";

const { fbConnector, postgresConnector } = ConfigureApp;

export const get = (id: string): Promise<TicketType | null> => {
  return new Promise((resolve, reject) => {
    fbConnector.read(
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

export const updateSeats = (
  id: string,
  selectedSeats: number[],
  status: string
): Promise<{ updated: boolean } | null> => {
  return new Promise((resolve, reject) => {
    try {
      const seatUpdates = selectedSeats.reduce((acc, seat) => {
        acc[seat - 1] = {
          status: status,
          number: seat,
        };
        return acc;
      }, {} as Record<number, any>);

      fbConnector
        .update(`Ticket Service/${id}/bus/seats`, seatUpdates)
        .then(() => {
          resolve({ updated: true });
        })
        .catch((error: Error) => {
          console.error("Error updating seats:", error);
          reject(null);
        });
    } catch (error) {
      console.error("Error in seat update process:", error);
      reject(null);
    }
  });
};

export const storeTickets = async (
  stripeID: string,
  { itinID, formData }: paymentInfo
): Promise<void> => {
  const formEntries: [string, SeatFormData][] = Object.entries(formData);

  const whereDiscountCondition = formEntries
    .map(([_, form]) => `"Name" = '${form.ticketType}'`)
    .join(" OR ");

  const discountData: any[] = await postgresConnector.fromDiscounts(
    '"Id"',
    whereDiscountCondition,
    (data) => {
      return data;
    }
  );

  const itineraryData: any[] = await postgresConnector.fromItineraries(
    '"Id"',
    `"Id" = ${itinID}`,
    (data) => {
      return data;
    }
  );

  let index: number = 0;
  for (const [seatNumber, seatData] of formEntries) {
    const { firstName, lastName, email } = seatData;

    const name: string = `${firstName} ${lastName}`;

    const ticketData: {
      Itinerary: string;
      SeatNumber: string;
      Name: string;
      Email: string;
      Discount: number;
    } = {
      Itinerary: itineraryData[0].Id,
      SeatNumber: seatNumber,
      Name: name,
      Email: email,
      Discount: discountData[index].Id,
    };

    try {
      const ticketResult = await postgresConnector.insertInto(
        "Tickets",
        ticketData,
        '"Id"'
      );
      console.log(
        `Inserted ticket row with SeatNumber: ${seatNumber}, ID: ${ticketResult.rows[0].Id}`
      );

      const transactionData: {
        Stripe_Id: string;
        Itinerary: string;
        Ticket: string;
      } = {
        Stripe_Id: stripeID,
        Itinerary: itineraryData[0].Id,
        Ticket: ticketResult.rows[0].Id,
      };

      await postgresConnector.insertInto(
        "Transactions",
        transactionData,
        undefined
      );

      index++;
    } catch (error) {
      console.error(
        `Failed to insert row with SeatNumber: ${seatNumber}, Error: ${error}`
      );
    }
  }
};
