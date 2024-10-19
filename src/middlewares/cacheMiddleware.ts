import NodeCache from "node-cache";
import { paymentInfo } from "../types/types";

const cache: NodeCache = new NodeCache({ stdTTL: 640 });

const getSessionData = (
  id: string
): { id: string; data: paymentInfo | undefined } => {
  return id && cache.has(id)
    ? { id: id, data: cache.get(id) }
    : { id: id, data: undefined };
};

const storeInCache = (id: string, data: any) => {
  return cache.set(id, data);
};

const checkDataInCache = (id: string): any => {
  return cache.has(id);
};

export { getSessionData, storeInCache, checkDataInCache };
