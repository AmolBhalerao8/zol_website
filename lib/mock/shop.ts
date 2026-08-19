import type { Shop } from "./types";

export const shop: Shop = {
  name: "Fifth Street Auto",
  address: "1420 Fifth Street, Bakersfield, CA 93304",
  laborRate: 145,
  taxRate: 0.0825,
  bayCount: 6,
  hours: [
    { day: "Monday", open: "07:30", close: "18:00", closed: false },
    { day: "Tuesday", open: "07:30", close: "18:00", closed: false },
    { day: "Wednesday", open: "07:30", close: "18:00", closed: false },
    { day: "Thursday", open: "07:30", close: "18:00", closed: false },
    { day: "Friday", open: "07:30", close: "17:00", closed: false },
    { day: "Saturday", open: "08:00", close: "14:00", closed: false },
    { day: "Sunday", open: "00:00", close: "00:00", closed: true },
  ],
};
