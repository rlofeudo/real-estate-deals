import { Deal } from '../models/deal.model';

const addresses = [
  '1200 Market St, San Francisco, CA',
  '450 Park Ave, New York, NY',
  '800 Peachtree St NE, Atlanta, GA',
  '221B Baker St, Chicago, IL',
  '500 Boylston St, Boston, MA',
  '1600 Amphitheatre Pkwy, Mountain View, CA',
  '350 5th Ave, New York, NY',
  '1 Infinite Loop, Cupertino, CA',
  '233 S Wacker Dr, Chicago, IL',
  '700 Louisiana St, Houston, TX',
  '200 S Biscayne Blvd, Miami, FL',
  '100 Congress Ave, Austin, TX',
  '400 W Market St, Louisville, KY',
  '55 Public Square, Cleveland, OH',
  '150 N Riverside Plaza, Chicago, IL',
];

const dealNames = [
  'Harbor View Apartments',
  'Summit Office Tower',
  'Riverfront Retail Center',
  'Oakwood Multifamily',
  'Pioneer Industrial Park',
  'Lakeside Medical Plaza',
  'Cedar Grove Condos',
  'Metro Gateway Mixed-Use',
  'Sunset Boulevard Retail',
  'Northside Warehouse Hub',
  'Elm Street Townhomes',
  'Capitol Hill Offices',
  'Bayshore Logistics Center',
  'Highland Park Residences',
  'Downtown Courtyard Hotel',
  'West End Shopping Plaza',
  'Greenfield Business Park',
  'Canal Street Lofts',
  'Parkside Senior Living',
  'Union Station Retail',
  'Maple Ridge Apartments',
  'Tech Corridor Campus',
  'Seaside Resort Condos',
  'Central Avenue Offices',
  'Brookside Family Homes',
  'Airport Commerce Center',
  'Midtown Flex Space',
  'Valley View Retail',
  'Heritage Square Mixed-Use',
  'Eastgate Industrial Yard',
];

export function createMockDeals(): Deal[] {
  return dealNames.map((name, index) => {
    const purchasePrice = 1_500_000 + index * 275_000 + (index % 5) * 50_000;
    const noi = Math.round(purchasePrice * (0.045 + (index % 7) * 0.002));

    return {
      id: index + 1,
      name,
      purchasePrice,
      address: addresses[index % addresses.length],
      noi,
    };
  });
}
