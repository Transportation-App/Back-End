import * as Classes from "./Classes";

export default function initializeAssociations() {
	// Cities many-to-many relationship through Stops
	Classes.City.belongsToMany(Classes.City, {
		as: "OriginCities",
		through: Classes.Stop,
		foreignKey: "CityA",
		otherKey: "CityB",
	});
	Classes.City.belongsToMany(Classes.City, {
		as: "DestinationCities",
		through: Classes.Stop,
		foreignKey: "CityB",
		otherKey: "CityA",
	});

	// Itineraries-Cities one-to-many relationship
	Classes.Itinerary.belongsTo(Classes.City, {
		as: "DepartureCityObj",
		foreignKey: "DepartureCity",
	});
	Classes.Itinerary.belongsTo(Classes.City, {
		as: "ArrivalCityObj",
		foreignKey: "ArrivalCity",
	});

	// Tickets-Itineraries one-to-many relationship
	Classes.Ticket.belongsTo(Classes.Itinerary, {
		as: "ItineraryObj",
		foreignKey: "Itinerary",
	});
	// Tickets-Discounts one-to-many relationship
	Classes.Ticket.belongsTo(Classes.Discount, {
		as: "DiscountObj",
		foreignKey: "Discount",
	});

	// Transactions-Itineraries one-to-many relationship
	Classes.Transaction.belongsTo(Classes.Itinerary, {
		as: "ItineraryObj",
		foreignKey: "Itinerary",
	});
	// Transactions-Ticket one-to-many relationship
	Classes.Transaction.belongsTo(Classes.Ticket, {
		as: "TicketObj",
		foreignKey: "Ticket",
	});
}
