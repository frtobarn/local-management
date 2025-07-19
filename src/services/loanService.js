// src/services/loanService.js
import { db } from "../db";

export const addUser = async (name, dni, age, genre) => {
  const newUser = { name, dni, age, genre, status: "active" };
  const id = await db.users.add(newUser);
  return id;
};

export const getUsers = async () => {
  const users = await db.users.toArray();
  return users;
};

export const deleteUser = async (id) => {
  await db.users.delete(id);
};

export const addItem = async (name, code, status, type) => {
  const id = await db.items.add({ name, code, status, type });
  return id;
};

export const getItems = async () => {
  const items = await db.items.toArray();
  return items;
};

export const deleteItem = async (id) => {
  await db.items.delete(id);
};

export const updateUser = async (id, userData) => {
  const updated = await db.users.update(id, userData);
  return updated;
};

export const updateItem = async (id, itemData) => {
  const updated = await db.items.update(id, itemData);
  return updated;
};

/*
 *
 */
export const addLoan = async (userId, itemId, duration) => {
  // Primero verificamos que existan tanto el usuario como el elemento
  const user = await db.users.get(Number(userId));
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const item = await db.items.get(Number(itemId));
  if (!item) {
    throw new Error("Elemento no encontrado");
  }

  // Verificamos si el elemento ya está prestado
  const activeItemLoans = await db.loans
    .where('itemId')
    .equals(Number(itemId))
    .filter(loan => !loan.returned)
    .toArray();

  if (activeItemLoans.length > 0) {
    throw new Error("Este elemento ya está prestado");
  }

  // Verificamos si el usuario ya tiene un préstamo activo
  const activeUserLoans = await db.loans
    .where('userId')
    .equals(Number(userId))
    .filter(loan => !loan.returned)
    .toArray();

  if (activeUserLoans.length > 0) {
    throw new Error("Este usuario ya tiene un préstamo activo");
  }

  const startTime = Date.now();
  const id = await db.loans.add({
    userId: Number(userId),
    itemId: Number(itemId),
    startTime,
    duration,
    returned: false,
    userName: user.name,
    itemName: item.name
  });
  
  return id;
};

export const getLoans = async () => {
  const loans = await db.loans.toArray();
  
  // Obtener detalles faltantes y ordenar por fecha más reciente
  const loansWithDetails = await Promise.all(
    loans.map(async (loan) => {
      let loanWithDetails = loan;
      let itemCode = loan.itemCode;
      if (!loan.userName || !loan.itemName || !loan.itemCode) {
        const user = await db.users.get(Number(loan.userId));
        const item = await db.items.get(Number(loan.itemId));
        loanWithDetails = {
          ...loan,
          userName: user?.name || 'Usuario no encontrado',
          itemName: item?.name || 'Elemento no encontrado',
          itemCode: item?.code || '',
        };
      }
      return loanWithDetails;
    })
  );

  // Ordenar préstamos por fecha más reciente primero
  return loansWithDetails.sort((a, b) => b.startTime - a.startTime);
};

export const deleteLoan = async (id) => {
  await db.loans.delete(id);
};

export const updateLoan = async (id, returned, newDuration) => {
  const updateObj = {};
  if (returned) {
    updateObj.endTime = Date.now();
    updateObj.returned = true;
  }
  if (typeof newDuration === 'number') {
    updateObj.duration = newDuration;
  }
  const updated = await db.loans.update(id, updateObj);
  return updated;
};
