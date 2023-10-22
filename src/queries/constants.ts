import { v4 as uuidv4 } from "uuid";
import { Entity } from "./types";

export const storageKey = "usersToUserGroups";

export const MOCK_USERS: Entity[] = [
  { id: uuidv4(), name: "Abigail Perez" },
  { id: uuidv4(), name: "Alan Carter" },
  { id: uuidv4(), name: "Alice Walker" },
  { id: uuidv4(), name: "Andrew Hamilton" },
  { id: uuidv4(), name: "Anthony Roberts" },
  { id: uuidv4(), name: "Barbara Lee" },
  { id: uuidv4(), name: "Brice Gill" },
  { id: uuidv4(), name: "Cameron Diaz" },
  { id: uuidv4(), name: "Danielle Brooks" },
  { id: uuidv4(), name: "Edward Holmes" },
  { id: uuidv4(), name: "Elena Jenkins" },
  { id: uuidv4(), name: "Felicity Jones" },
  { id: uuidv4(), name: "George Baker" },
  { id: uuidv4(), name: "Hannah Murphy" },
  { id: uuidv4(), name: "Isaac Clarke" },
  { id: uuidv4(), name: "Jackie Chan" },
  { id: uuidv4(), name: "James Dean" },
  { id: uuidv4(), name: "Kael Garrison" },
  { id: uuidv4(), name: "Kathleen Turner" },
  { id: uuidv4(), name: "Leonardo Smith" },
  { id: uuidv4(), name: "Livia Obrien" },
  { id: uuidv4(), name: "Mariah Carey" },
  { id: uuidv4(), name: "Nathaly Le" },
  { id: uuidv4(), name: "Oliver Grant" },
  { id: uuidv4(), name: "Patrick Stewart" },
  { id: uuidv4(), name: "Paula Johnson" },
  { id: uuidv4(), name: "Pranav Melendez" },
  { id: uuidv4(), name: "Rachel Green" },
  { id: uuidv4(), name: "Rebecca Moore" },
  { id: uuidv4(), name: "Robert Downey" },
  { id: uuidv4(), name: "Savion Jordan" },
  { id: uuidv4(), name: "Stephen Carney" },
  { id: uuidv4(), name: "Sylvia Stone" },
  { id: uuidv4(), name: "Thomas Wright" },
  { id: uuidv4(), name: "Tina Fey" },
  { id: uuidv4(), name: "Tyler James" },
  { id: uuidv4(), name: "Ulysses Grant" },
  { id: uuidv4(), name: "Valeria Lukyanova" },
  { id: uuidv4(), name: "Walter White" },
  { id: uuidv4(), name: "Yasmine Alibhai" },
];

export const MOCK_USERS_GROUPS: Entity[] = [
  { id: uuidv4(), name: "Accounting" },
  { id: uuidv4(), name: "C Level" },
  { id: uuidv4(), name: "Key Users" },
  { id: uuidv4(), name: "Purchasing" },
  { id: uuidv4(), name: "SuperAdmin" },
  { id: uuidv4(), name: "Group 6" },
  { id: uuidv4(), name: "Group 7" },
  { id: uuidv4(), name: "Group 8" },
  { id: uuidv4(), name: "Group 9" },
];

export const storageInit: Record<string, string[]> = MOCK_USERS.reduce<
  Record<string, string[]>
>((acc, cur) => {
  acc[cur.id] = [];
  return acc;
}, {});
