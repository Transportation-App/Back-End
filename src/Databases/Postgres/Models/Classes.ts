import { Model, Sequelize } from "sequelize";
import initializeAssociations from "./Associations";
import * as Attributes from "./Attributes";

export class City extends Model {}
export class Discount extends Model {}
export class Itinerary extends Model {}
export class Stop extends Model {}
export class Ticket extends Model {}
export class Transaction extends Model {}
export class User extends Model {}

export async function initializeModels(sequelize: Sequelize) {
	const options = {
		sequelize,
		timestamps: false,
	};

	City.init(Attributes.CityAttributes, options);
	Stop.init(Attributes.StopAttributes, options);
	Discount.init(Attributes.DiscountAttributes, options);
	Itinerary.init(Attributes.ItineraryAttributes, options);
	Ticket.init(Attributes.TicketAttributes, options);
	Transaction.init(Attributes.TransactionAttributes, options);
	User.init(Attributes.UserAttributes, options);

	initializeAssociations();

	await sequelize.sync();
}
