import * as protobuf from "protobufjs";

export interface FlightData {
  date: string;
  from_airport: string;
  to_airport: string;
  max_stops?: number;
}

export enum Trip {
  ROUND_TRIP = 1,
  ONE_WAY = 2,
  MULTI_CITY = 3,
}

export enum Seat {
  ECONOMY = 1,
  PREMIUM_ECONOMY = 2,
  BUSINESS = 3,
  FIRST = 4,
}

export interface Passengers {
  adults: number;
  children: number;
  infants_in_seat: number;
  infants_on_lap: number;
}

export type TripType = "round-trip" | "one-way" | "multi-city";
export type SeatType = "economy" | "premium-economy" | "business" | "first";

export const stringToTrip = (trip: TripType): Trip => {
  const tripMap = {
    "round-trip": Trip.ROUND_TRIP,
    "one-way": Trip.ONE_WAY,
    "multi-city": Trip.MULTI_CITY,
  };
  return tripMap[trip];
};

export const stringToSeat = (seat: SeatType): Seat => {
  const seatMap = {
    economy: Seat.ECONOMY,
    "premium-economy": Seat.PREMIUM_ECONOMY,
    business: Seat.BUSINESS,
    first: Seat.FIRST,
  };
  return seatMap[seat];
};


export class TFSData {
  constructor(
    private readonly flight_data: FlightData[],
    private readonly seat: Seat,
    private readonly trip: Trip,
    private readonly passengers: Passengers,
    private readonly max_stops?: number
  ) {}

  private createProtobufDefinition() {
    const root = new protobuf.Root();

    // Enums exatamente como no GOOGLE FLIGHTS
    const Seat = new protobuf.Enum("Seat", {
      UNKNOWN_SEAT: 0,
      ECONOMY: 1,
      PREMIUM_ECONOMY: 2,
      BUSINESS: 3,
      FIRST: 4,
    });

    const Trip = new protobuf.Enum("Trip", {
      UNKNOWN_TRIP: 0,
      ROUND_TRIP: 1,
      ONE_WAY: 2,
      MULTI_CITY: 3,
    });

    const Passenger = new protobuf.Enum("Passenger", {
      UNKNOWN_PASSENGER: 0,
      ADULT: 1,
      CHILD: 2,
      INFANT_IN_SEAT: 3,
      INFANT_ON_LAP: 4,
    });

    const Airport = new protobuf.Type("Airport").add(
      new protobuf.Field("airport", 2, "string")
    );

    const FlightData = new protobuf.Type("FlightData")
      .add(new protobuf.Field("date", 2, "string"))
      .add(new protobuf.Field("from_flight", 13, "Airport"))
      .add(new protobuf.Field("to_flight", 14, "Airport"))
      .add(new protobuf.Field("max_stops", 5, "int32", "optional"));

    const Info = new protobuf.Type("Info")
      .add(new protobuf.Field("data", 3, "FlightData", "repeated"))
      .add(new protobuf.Field("seat", 9, "Seat"))
      .add(new protobuf.Field("passengers", 8, "Passenger", "repeated"))
      .add(new protobuf.Field("trip", 19, "Trip"));

    root
      .add(Seat)
      .add(Trip)
      .add(Passenger)
      .add(Airport)
      .add(FlightData)
      .add(Info);

    return root;
  }

  public toBuffer(): Buffer {
    const root = this.createProtobufDefinition();
    const Info = root.lookupType("Info");

    const message = {
      data: this.flight_data.map((fd) => ({
        date: fd.date,
        from_flight: { airport: fd.from_airport },
        to_flight: { airport: fd.to_airport },
        max_stops: fd.max_stops || 0,
      })),
      passengers: Array(this.passengers.adults)
        .fill(1)
        .concat(Array(this.passengers.children).fill(2))
        .concat(Array(this.passengers.infants_in_seat).fill(3))
        .concat(Array(this.passengers.infants_on_lap).fill(4)),
      seat: this.seat,
      trip: this.trip,
    };

    return Buffer.from(Info.encode(message).finish());
  }

  public toBase64(): string {
    return this.toBuffer().toString("base64");
  }

  public static fromInterface(
    flight_data: FlightData[],
    trip: "round-trip" | "one-way" | "multi-city",
    passengers: Passengers,
    seat: "economy" | "premium-economy" | "business" | "first",
    max_stops?: number
  ): TFSData {
    const seatMap = {
      economy: Seat.ECONOMY,
      "premium-economy": Seat.PREMIUM_ECONOMY,
      business: Seat.BUSINESS,
      first: Seat.FIRST,
    };

    const tripMap = {
      "round-trip": Trip.ROUND_TRIP,
      "one-way": Trip.ONE_WAY,
      "multi-city": Trip.MULTI_CITY,
    };

    return new TFSData(
      flight_data,
      seatMap[seat],
      tripMap[trip],
      passengers,
      max_stops
    );
  }
}


