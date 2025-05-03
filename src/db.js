// src/db.js
import Dexie from "dexie";

export const db = new Dexie("MultiDB");

// 👇 Incluye TODAS las tablas en un SOLO .version()
db.version(1).stores({
  users: "++id, name, &dni, age, genre, status", // &dni = único
  items: "++id, name, &code, status, type",
  loans: "++id, userId, itemId, startTime, endTime, duration, returned",
});

db.open()
  .then(() => console.log("BD abierta ok"))
  .catch((e) => console.error("Fallo al abrir", e)); 

// export const db =
//   globalThis.__multiDb__ || (globalThis.__multiDb__ = (() => {
//     const d = new Dexie('MultiDB');          // ⇦ nombre definitivo
//     d.version(2).stores({                    // ⇦ sube a 2
//       users : '++id,&dni,name,age,genre,status',
//       items : '++id,&code,name,status,type',
//       loans : '++id,userId,itemId,startTime,duration,returned' // sin duplicado
//     });
//     return d;
//   })());

// Si algún día cambias un índice ➜ incrementa el número:
// db.version(2).stores({ ...nuevo esquema completo... });
// db.version(2).stores({
//     users : '++id,&name',
//     items : '++id,&name',
//     loans : '++id,userId,itemId,startTime,duration,returned'
//   }).upgrade(tx => {
//     // migraciones opcionales
//   });
