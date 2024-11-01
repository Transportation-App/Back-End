import NodeCache from "node-cache";
import { paymentInfo } from "../Types/types";

const cache: NodeCache = new NodeCache({ stdTTL: 640 });

/**
 * Retrieves session data from the cache for a given ID.
 * The data type is generic, allowing for flexible data handling.
 */
const getSessionData = <T>(id: string): { id: string; data: T | undefined } => {
  return id && cache.has(id)
    ? { id: id, data: cache.get<T>(id) }
    : { id: id, data: undefined };
};

/**
 * Stores data in the cache with a specified ID.
 * The data type is generic to allow any data type to be stored.
 */
const storeInCache = <T>(id: string, data: T): boolean => {
  return cache.set(id, data);
};

/**
 * Checks if data exists in the cache for a given ID.
 */
const checkDataInCache = (id: string): any => {
  return cache.has(id);
};

export { getSessionData, storeInCache, checkDataInCache };
