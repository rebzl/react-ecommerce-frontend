/**
 * Define de range of prices to be used in the shop filters
 * name = Display on the view
 * array = Value to send to the BE
 */
export const prices = [
  // Filter by default
  {
    _id: 0,
    name: "Any",
    array: [],
  },
  {
    _id: 1,
    name: "$0 tp $9",
    array: [0, 9],
  },
  {
    _id: 2,
    name: "$10 tp $19",
    array: [10, 19],
  },
  {
    _id: 3,
    name: "$20 tp $29",
    array: [20, 29],
  },
  {
    _id: 4,
    name: "$30 tp $39",
    array: [30, 39],
  },
  {
    _id: 5,
    name: "More than $40",
    array: [40, 99],
  },
];
