import type { Vehicle } from "./types";

export const vehicles: Vehicle[] = [
  { id: "v-01", customerId: "c-01", year: 2018, make: "Ford", model: "F-150 XLT", vin: "1FTEW1EP4JKD82910", plate: "8XKR241", mileage: 118420 },
  { id: "v-02", customerId: "c-01", year: 2012, make: "Honda", model: "Civic LX", vin: "2HGFB2F58CH314077", plate: "6RTP883", mileage: 189350 },
  { id: "v-03", customerId: "c-02", year: 2020, make: "Toyota", model: "RAV4 LE", vin: "JTMH1RFV5LD059214", plate: "9CMD517", mileage: 61230 },
  { id: "v-04", customerId: "c-03", year: 2015, make: "Chevrolet", model: "Silverado 1500", vin: "3GCUKREC7FG208866", plate: "4YHN092", mileage: 154870 },
  { id: "v-05", customerId: "c-03", year: 2019, make: "Subaru", model: "Outback 2.5i", vin: "4S4BSANC9K3391204", plate: "7LWQ316", mileage: 82940 },
  { id: "v-06", customerId: "c-04", year: 2021, make: "Hyundai", model: "Elantra SEL", vin: "5NPLM4AG4MH017733", plate: "8PDF470", mileage: 44115 },
  { id: "v-07", customerId: "c-05", year: 2016, make: "Ram", model: "1500 Big Horn", vin: "1C6RR7LT8GS155902", plate: "5KJB728", mileage: 141660 },
  { id: "v-08", customerId: "c-06", year: 2014, make: "Nissan", model: "Altima 2.5 S", vin: "1N4AL3AP7EC178440", plate: "6WQX155", mileage: 167230 },
  { id: "v-09", customerId: "c-07", year: 2017, make: "GMC", model: "Sierra 1500 SLE", vin: "3GTU2MEC1HG440118", plate: "3NRV604", mileage: 132980 },
  { id: "v-10", customerId: "c-07", year: 2013, make: "Toyota", model: "Corolla LE", vin: "5YFBU4EE9DP102965", plate: "7BDC839", mileage: 201470 },
  { id: "v-11", customerId: "c-08", year: 2019, make: "Mazda", model: "CX-5 Touring", vin: "JM3KFBCM1K0603177", plate: "8GHL226", mileage: 71540 },
  { id: "v-12", customerId: "c-09", year: 2011, make: "Ford", model: "Escape XLT", vin: "1FMCU9DG3BKB19288", plate: "5TPN471", mileage: 198110 },
  { id: "v-13", customerId: "c-10", year: 2008, make: "Chevrolet", model: "Tahoe LT", vin: "1GNFK13008R204551", plate: "4JMS067", mileage: 243890 },
  { id: "v-14", customerId: "c-10", year: 2016, make: "Ford", model: "Fusion SE", vin: "3FA6P0H73GR388120", plate: "9QWD302", mileage: 128760 },
  { id: "v-15", customerId: "c-11", year: 2022, make: "Kia", model: "Forte LXS", vin: "3KPF24AD1NE472019", plate: "8VNB914", mileage: 29840 },
  { id: "v-16", customerId: "c-12", year: 2017, make: "Jeep", model: "Grand Cherokee", vin: "1C4RJFBG9HC748031", plate: "6HZP580", mileage: 119320 },
  { id: "v-17", customerId: "c-13", year: 2014, make: "Honda", model: "Accord EX", vin: "1HGCR2F73EA290166", plate: "5FRK237", mileage: 176450 },
  { id: "v-18", customerId: "c-14", year: 2020, make: "Ford", model: "Ranger XLT", vin: "1FTER4FH8LLA11907", plate: "9DTL665", mileage: 58270 },
  { id: "v-19", customerId: "c-15", year: 2015, make: "Volkswagen", model: "Jetta S", vin: "3VW2K7AJ9FM301884", plate: "7MCG148", mileage: 149930 },
  { id: "v-20", customerId: "c-16", year: 2010, make: "Dodge", model: "Grand Caravan", vin: "2D4RN5D18AR366270", plate: "4BKV721", mileage: 212540 },
  { id: "v-21", customerId: "c-17", year: 2018, make: "Chevrolet", model: "Equinox LT", vin: "2GNAXJEV1J6155903", plate: "8SRW430", mileage: 96180 },
  { id: "v-22", customerId: "c-18", year: 2021, make: "Toyota", model: "Tacoma SR5", vin: "3TMCZ5AN0MM384112", plate: "9HKP057", mileage: 41260 },
  { id: "v-23", customerId: "c-19", year: 2013, make: "Ford", model: "F-250 Super Duty", vin: "1FT7W2BT9DEA55218", plate: "5NDJ892", mileage: 187640 },
  { id: "v-24", customerId: "c-20", year: 2019, make: "Nissan", model: "Rogue SV", vin: "5N1AT2MV2KC744300", plate: "8LQF163", mileage: 77390 },
  { id: "v-25", customerId: "c-21", year: 2016, make: "Subaru", model: "Forester 2.5i", vin: "JF2SJADC3GH512866", plate: "6XTB509", mileage: 138720 },
  { id: "v-26", customerId: "c-22", year: 2012, make: "GMC", model: "Yukon SLT", vin: "1GKS2CE07CR201477", plate: "4WPN336", mileage: 224180 },
  { id: "v-27", customerId: "c-23", year: 2020, make: "Honda", model: "CR-V EX", vin: "7FARW2H84LE026591", plate: "9GVM748", mileage: 63410 },
  { id: "v-28", customerId: "c-24", year: 2017, make: "Ford", model: "Explorer XLT", vin: "1FM5K7D80HGB09244", plate: "7JCR215", mileage: 124890 },
  { id: "v-29", customerId: "c-25", year: 2009, make: "Toyota", model: "Camry LE", vin: "4T1BE46K19U833107", plate: "3QLD960", mileage: 251330 },
  { id: "v-30", customerId: "c-25", year: 2018, make: "Ram", model: "2500 Tradesman", vin: "3C6UR5CL2JG133845", plate: "8ZKX402", mileage: 109570 },
];

export function getVehicle(id: string): Vehicle | undefined {
  return vehicles.find((vehicle) => vehicle.id === id);
}

export function getVehiclesForCustomer(customerId: string): Vehicle[] {
  return vehicles.filter((vehicle) => vehicle.customerId === customerId);
}
