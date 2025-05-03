// src/hooks/useDexie.js
import { useEffect } from 'react';
import { db } from '../db';

export const useDexie = () => {
  useEffect(() => () => db.close(), []);   // cierra al desmontar la app
  return db;
};