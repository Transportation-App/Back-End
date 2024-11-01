import { ModelAttributes, Optional, DataTypes } from "sequelize";
import * as Classes from "./Classes";

const id_attribute = {
  type: DataTypes.INTEGER,
  autoIncrement: true,
  allowNull: false,
  unique: true,
  primaryKey: true,
};

export const CityAttributes: ModelAttributes<
  Classes.City,
  Optional<any, never>
> = {
  Id: id_attribute,
  Name: {
    type: DataTypes.STRING(20),
  },
  "Lng / Lat": {
    type: DataTypes.GEOMETRY("POINT"),
  },
};

export const DiscountAttributes: ModelAttributes<
  Classes.Discount,
  Optional<any, never>
> = {
  Id: id_attribute,
  Name: {
    type: DataTypes.STRING(40),
  },
  Percentage: {
    type: DataTypes.REAL,
  },
};

export const ItineraryAttributes: ModelAttributes<
  Classes.Itinerary,
  Optional<any, never>
> = {
  Id: id_attribute,
  DepartureDate: {
    type: DataTypes.DATEONLY,
  },
  ArrivalDate: {
    type: DataTypes.DATEONLY,
  },
  DepartureTime: {
    type: DataTypes.TIME,
  },
  ArrivalTime: {
    type: DataTypes.TIME,
  },
  Price: {
    type: "money",
  },
  Stops: {
    type: DataTypes.INTEGER,
  },
};

export const StopAttributes: ModelAttributes<
  Classes.Stop,
  Optional<any, never>
> = {
  Id: id_attribute,
};

export const TicketAttributes: ModelAttributes<
  Classes.Ticket,
  Optional<any, never>
> = {
  Id: id_attribute,
  SeatNumber: {
    type: DataTypes.INTEGER,
  },
  Name: {
    type: DataTypes.STRING(40),
  },
  Email: {
    type: DataTypes.STRING(30),
  },
};

export const TransactionAttributes: ModelAttributes<
  Classes.Transaction,
  Optional<any, never>
> = {
  Id: id_attribute,
  Stripe_Id: {
    type: DataTypes.STRING(66),
  },
};

export const UserAttributes: ModelAttributes<
  Classes.City,
  Optional<any, never>
> = {
  Id: id_attribute,
  Username: {
    type: DataTypes.STRING(10),
  },
  Password: {
    type: DataTypes.STRING(20),
  },
};
