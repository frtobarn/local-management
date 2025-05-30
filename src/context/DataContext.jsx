import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);

  const updateUsers = (newUsers) => {
    setUsers(newUsers);
  };

  const updateItems = (newItems) => {
    setItems(newItems);
  };

  return (
    <DataContext.Provider value={{ users, items, updateUsers, updateItems }}>
      {children}
    </DataContext.Provider>
  );
}; 