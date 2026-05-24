import type {
  TekmetricRawAppointment,
  TekmetricRawCustomer,
  TekmetricRawRepairOrder,
  TekmetricRawVehicle,
} from "@/features/integrations/services/tekmetric/types";

function tomorrowAt(hour: number): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

export function getMockTekmetricCustomers(): TekmetricRawCustomer[] {
  return [
    {
      id: "tm-cust-1001",
      firstName: "Max",
      lastName: "Rivera",
      phone: "+15307179645",
      email: "max.rivera@example.com",
    },
    {
      id: "tm-cust-1002",
      firstName: "Test",
      lastName: "Caller",
      phone: "+15551234567",
      email: "test.caller@example.com",
    },
    {
      id: "tm-cust-1003",
      firstName: "Sarah",
      lastName: "Mitchell",
      phone: "+15559876543",
      email: "sarah.mitchell@example.com",
    },
  ];
}

export function getMockTekmetricVehicles(): TekmetricRawVehicle[] {
  return [
    {
      id: "tm-veh-2001",
      customerId: "tm-cust-1001",
      year: 2012,
      make: "Ford",
      model: "F-150",
      vin: "1FTFW1ET2DFC10312",
    },
    {
      id: "tm-veh-2002",
      customerId: "tm-cust-1002",
      year: 2018,
      make: "Toyota",
      model: "Camry",
      vin: "4T1B11HK5JU123456",
    },
    {
      id: "tm-veh-2003",
      customerId: "tm-cust-1003",
      year: 2018,
      make: "Toyota",
      model: "Camry",
      vin: "4T1BF1FK5JU987654",
    },
  ];
}

export function getMockTekmetricAppointments(): TekmetricRawAppointment[] {
  return [
    {
      id: "tm-appt-3001",
      customerId: "tm-cust-1001",
      startTime: tomorrowAt(9),
      status: "Scheduled",
      description: "Vehicle inspection and repair — older truck not running properly",
    },
    {
      id: "tm-appt-3002",
      customerId: "tm-cust-1002",
      startTime: tomorrowAt(14),
      status: "Scheduled",
      description: "Brake noise diagnosis — Toyota Camry",
    },
    {
      id: "tm-appt-3003",
      customerId: "tm-cust-1003",
      startTime: tomorrowAt(11),
      status: "Confirmed",
      description: "Brake vibration follow-up inspection",
    },
  ];
}

export function getMockTekmetricRepairOrders(): TekmetricRawRepairOrder[] {
  return [
    {
      id: "tm-ro-4001",
      customerId: "tm-cust-1001",
      status: "In Progress",
      total: 485.5,
      description: "Engine diagnostics and starter replacement estimate",
    },
    {
      id: "tm-ro-4002",
      customerId: "tm-cust-1002",
      status: "Estimate",
      total: 320,
      description: "Front brake pad replacement — grinding noise reported",
    },
    {
      id: "tm-ro-4003",
      customerId: "tm-cust-1003",
      status: "Completed",
      total: 189.99,
      description: "Oil change and brake vibration inspection",
    },
  ];
}
