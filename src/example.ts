import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { FlightData, Passengers, SeatType, TFSData } from './types';

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('origin', {
      type: 'string',
      demandOption: true,
      description: 'Origin airport code'
    })
    .option('destination', {
      type: 'string',
      demandOption: true,
      description: 'Destination airport code'
    })
    .option('depart_date', {
      type: 'string',
      demandOption: true,
      description: 'Departure date (YYYY-MM-DD)'
    })
    .option('return_date', {
      type: 'string',
      demandOption: true,
      description: 'Return date (YYYY-MM-DD)'
    })
    .option('adults', {
      type: 'number',
      default: 1,
      description: 'Number of adult passengers'
    })
    .option('children', {
      type: 'number',
      default: 0,
      description: 'Number of children passengers'
    })
    .option('infants_in_seat', {
      type: 'number',
      default: 0,
      description: 'Number of infants_in_seat passengers'
    })
    .option('infants_on_lap', {
      type: 'number',
      default: 0,
      description: 'Number of infants_on_lap passengers'
    })
    .option('type', {
      type: 'string',
      default: 'economy',
      choices: ['economy', 'premium-economy', 'business', 'first']
    })
    .option('max_stops', {
      type: 'number',
      description: 'Maximum number of stops'
    })
    .parse();

  const flightData: FlightData[] = [
    {
      date: argv.depart_date,
      from_airport: argv.origin,
      to_airport: argv.destination,
      max_stops: argv.max_stops
    },
    {
      date: argv.return_date,
      from_airport: argv.destination,
      to_airport: argv.origin,
      max_stops: argv.max_stops
    }
  ];

  const passengers: Passengers = {
    adults: argv.adults,
    children: argv.children,
    infants_in_seat: argv.infants_in_seat,
    infants_on_lap: argv.infants_on_lap
  };

  const tfsData = TFSData.fromInterface(
    flightData,
    'round-trip',
    passengers,
    argv.type as SeatType,
    argv.max_stops
  );

  const filter = tfsData.toBase64();
  console.log(`https://www.google.com/travel/flights?tfs=${filter}`);
}

main().catch(console.error);
