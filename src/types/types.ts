export type BusType = {
  seats: SeatType[];
  type: string;
};

export type HourType = {
  departure: string;
  arrive: string;
};

export type ItineraryType = {
  id: string;
  hours: HourType[];
  stations: StationType[];
  stops: StopType[];
  numberOfPassengers: number;
};

export type SeatType = {
  number: number;
  status: string;
};

export type StationType = {
  from: string;
  to: string;
};

export type StopType = {
  seqNum: string;
  name: string;
  location: string;
  time: number; //minutes
};

export type TicketType = {
  initPrice: number;
  bus: BusType;
  numberOfPassenger: number;
};

export type SeatFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  ticketDiscount: number;
  ticketType: string;
  ticketPrice: number;
};

export type paymentInfo = {
  itinID: string;
  totalPrice: number;
  formData: Record<number, SeatFormData>;
};
