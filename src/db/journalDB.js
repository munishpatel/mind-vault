import Dexie from "dexie";

const journalDB = new Dexie("MindVaultDB");

journalDB.version(1).stores({
  notes: "++id, content, timestamp, synced",
});

export default journalDB;
