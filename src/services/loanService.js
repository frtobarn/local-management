// src/services/loanService.js
import { db } from "../db";

export const addUser = async (name, dni, age, genre) => {
  const newUser = { name, dni, age, genre, status: "active" };
  const id = await db.users.add(newUser);
  return id;
};

export const getUsers = async () => {
  const users = await db.users.toArray();
  console.log("Usuarios obtenidos: ");
  users.map((user) => {
    console.log(user.id);
  });
  return users;
};

export const deleteUser = async (id) => {
  await db.users.delete(id);
};

export const addItem = async (name) => {
  const id = await db.items.add({ name });
  return id;
};

export const getItems = async () => {
  const items = await db.items.toArray();
  console.log("Items obtenidos: ");
  items.map((item) => {
    console.log(item.name, item.id);
  });
  return items;
};

export const deleteItem = async (id) => {
  console.log("Borrando " + id);
  await db.items.delete(id);
};

/*
 *
 */
export const addLoan = async (userId, itemId, duration) => {
  const startTime = Date.now();
  const id = await db.loans.add({
    userId,
    itemId,
    startTime,
    duration,
    returned: false,
  });
  return id;
};

export const getLoans = async () => {
  const loans = await db.loans.toArray();
  console.log("Prestamos obtenidos: ");
  loans.map((loan) => {
    "++id, userId, itemId, startTime, duration, returned";
    console.log(
      "Prestamo " +
        loan.id +
        "| user: " +
        loan.userId +
        "| item: " +
        loan.itemId +
        "| startTime: " +
        loan.startTime +
        "| duration: " +
        loan.duration +
        "| returned: " +
        loan.returned
    );
  });
  return await db.loans.toArray();
};

export const deleteLoan = async (id) => {
  await db.loans.delete(id);
};

export const updateLoan = async (id, returned) => {
  const endTime = Date.now();
  const updated = await db.loans.update(id, {
    endTime,
    returned: true,
  });
  return updated;
};
