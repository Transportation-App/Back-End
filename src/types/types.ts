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
  // type: string;
  isRes: boolean;
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
  DeptHour: string;
  ArrHour: string;
  Duration: number;
  DeptCity: string;
  ArrCity: string;
  DeptDate: string;
  ArrDate: string;
  initPrice: number;
  bus: BusType;
  numberOfPassenger: number;
};
