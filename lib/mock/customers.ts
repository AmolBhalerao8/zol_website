import type { Customer } from "./types";

export const customers: Customer[] = [
  { id: "c-01", name: "Ruben Salazar", phone: "(661) 555-0142", email: "ruben.salazar@example.com", tenureMonths: 41 },
  { id: "c-02", name: "Dana Whitfield", phone: "(661) 555-0188", email: "dana.whitfield@example.com", tenureMonths: 7 },
  { id: "c-03", name: "Marcus Boone", phone: "(661) 555-0119", email: "mboone@example.com", tenureMonths: 63 },
  { id: "c-04", name: "Priya Raman", phone: "(661) 555-0204", email: "priya.raman@example.com", tenureMonths: 15 },
  { id: "c-05", name: "Terrance Fields", phone: "(661) 555-0177", email: "tfields@example.com", tenureMonths: 29 },
  { id: "c-06", name: "Joanne Pike", phone: "(661) 555-0163", email: "jpike@example.com", tenureMonths: 4 },
  { id: "c-07", name: "Hector Villanueva", phone: "(661) 555-0250", email: "hector.v@example.com", tenureMonths: 52 },
  { id: "c-08", name: "Sam Okonkwo", phone: "(661) 555-0131", email: "sokonkwo@example.com", tenureMonths: 11 },
  { id: "c-09", name: "Lindsay Groves", phone: "(661) 555-0198", email: "lgroves@example.com", tenureMonths: 22 },
  { id: "c-10", name: "Ed Barnhart", phone: "(661) 555-0107", email: "ebarnhart@example.com", tenureMonths: 78 },
  { id: "c-11", name: "Nicole Trang", phone: "(661) 555-0245", email: "ntrang@example.com", tenureMonths: 9 },
  { id: "c-12", name: "Curtis Mayhew", phone: "(661) 555-0122", email: "cmayhew@example.com", tenureMonths: 34 },
  { id: "c-13", name: "Alma Reyes", phone: "(661) 555-0159", email: "areyes@example.com", tenureMonths: 47 },
  { id: "c-14", name: "Wes Duffy", phone: "(661) 555-0184", email: "wduffy@example.com", tenureMonths: 3 },
  { id: "c-15", name: "Bianca Cortez", phone: "(661) 555-0136", email: "bcortez@example.com", tenureMonths: 26 },
  { id: "c-16", name: "Roy Ferguson", phone: "(661) 555-0211", email: "rferguson@example.com", tenureMonths: 58 },
  { id: "c-17", name: "Kelly Ambrose", phone: "(661) 555-0148", email: "kambrose@example.com", tenureMonths: 18 },
  { id: "c-18", name: "Devin Nakamura", phone: "(661) 555-0192", email: "dnakamura@example.com", tenureMonths: 13 },
  { id: "c-19", name: "Sheila Grant", phone: "(661) 555-0175", email: "sgrant@example.com", tenureMonths: 36 },
  { id: "c-20", name: "Omar Haddad", phone: "(661) 555-0128", email: "ohaddad@example.com", tenureMonths: 6 },
  { id: "c-21", name: "Tessa Lindqvist", phone: "(661) 555-0233", email: "tlindqvist@example.com", tenureMonths: 20 },
  { id: "c-22", name: "Gil Ortiz", phone: "(661) 555-0166", email: "gortiz@example.com", tenureMonths: 44 },
  { id: "c-23", name: "Marla Underwood", phone: "(661) 555-0114", email: "munderwood@example.com", tenureMonths: 31 },
  { id: "c-24", name: "Anton Petrov", phone: "(661) 555-0201", email: "apetrov@example.com", tenureMonths: 8 },
  { id: "c-25", name: "Faye Kimball", phone: "(661) 555-0153", email: "fkimball@example.com", tenureMonths: 55 },
];

export function getCustomer(id: string): Customer | undefined {
  return customers.find((customer) => customer.id === id);
}
