import { DataSnapshot } from "firebase/database";
import ConfigureApp from "../Config/Config";
import { paymentInfo, SeatFormData, TicketType } from "../Types/types";
import { Models, Utils } from "../Database/Postgre/Models";
import { Op, where } from "sequelize";

const { fbConnector } = ConfigureApp;

export const getBus = (id: string): Promise<TicketType | null> => {
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
        .update(`Ticket Service/${id}/Bus/Seats`, seatUpdates)
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
  const whereDiscountCondition: string[] = formEntries.map(
    ([_, form]) => form.ticketType
  );

  const discountObj: Models.Discount[] = await Models.Discount.findAll({
    where: {
      Name: {
        [Op.or]: whereDiscountCondition,
      },
    },
    attributes: ["Id"],
  });

  const itineraryObj: Models.Itinerary | null = await Models.Itinerary.findOne({
    where: {
      Id: itinID,
    },
    attributes: ["Id"],
  });

  if (!itineraryObj) {
    return;
  }

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
      Itinerary: itineraryObj.dataValues.Id,
      SeatNumber: seatNumber,
      Name: name,
      Email: email,
      Discount: discountObj[index].dataValues.Id,
    };

    const ticketResult: Models.Ticket = await Models.Ticket.create({
      ...ticketData,
      attributes: ["Id"],
    });

    const transactionData: {
      Stripe_Id: string;
      Itinerary: string;
      Ticket: string;
    } = {
      Stripe_Id: stripeID,
      Itinerary: itineraryObj.dataValues.Id,
      Ticket: ticketResult.dataValues.Id,
    };

    await Models.Transaction.create({
      ...transactionData,
    });
    index++;
  }
};

export const getMapCoords = async (
  deptCity: string,
  arrCity: string
): Promise<any> => {
  try {
    const citiedIDs: Models.City[] = await Models.City.findAll({
      where: {
        Name: {
          [Op.or]: [deptCity, arrCity],
        },
      },
      attributes: ["Id", "Name", "Lng / Lat"],
    });

    if (citiedIDs.length < 2) {
      throw new Error("Both departure and arrival cities must be found.");
    }

    const itineraryData: Models.Itinerary | null =
      await Models.Itinerary.findOne({
        where: {
          DepartureCity: {
            [Op.eq]: citiedIDs[0].dataValues.Id,
          },
          ArrivalCity: {
            [Op.eq]: citiedIDs[1].dataValues.Id,
          },
        },
        attributes: ["Stops"],
      });

    if (!itineraryData) {
      throw new Error("No itinerary found for the specified cities.");
    }

    const stopsData: Models.Stop | null = await Models.Stop.findOne({
      where: {
        Id: itineraryData.dataValues.Stops,
      },
    });

    if (!stopsData) {
      throw new Error("No stops found for the specified itinerary.");
    }

    const stopsCoords: Models.City[] = await Models.City.findAll({
      where: {
        Id: {
          [Op.or]: [stopsData.dataValues.CityA, stopsData.dataValues.CityB],
        },
      },
      attributes: ["Id", "Name", "Lng / Lat"],
    });

    const itinerary = [citiedIDs[0], stopsCoords.flat(), citiedIDs[1]].flat();

    return itinerary;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while fetching map coordinates."
    );
  }
};
