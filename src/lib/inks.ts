export type Ink = {
  id: string;
  name: string;
  note: string;
  field: string;
  accent: string;
  flag: string;
  paper: string;
};

export const INKS: Ink[] = [
  {
    id: "workshop",
    name: "Workshop",
    note: "Teal field, coral spot, mustard flag.",
    field: "#0f5a54",
    accent: "#f0553b",
    flag: "#efb93b",
    paper: "#f3ecdc",
  },
  {
    id: "mustard",
    name: "Mustard",
    note: "Mustard field, deep teal spot, bone flag.",
    field: "#e8b02f",
    accent: "#124a42",
    flag: "#f4ede0",
    paper: "#fdf6e6",
  },
  {
    id: "plum",
    name: "Plum",
    note: "Plum field, gold spot, pink flag.",
    field: "#481f45",
    accent: "#f2b134",
    flag: "#e6c3d8",
    paper: "#f6ecd9",
  },
  {
    id: "newsprint",
    name: "Newsprint",
    note: "Bone field, brick spot, midnight flag.",
    field: "#e9dfc8",
    accent: "#d0452c",
    flag: "#1d4b63",
    paper: "#fbf7ee",
  },
];
