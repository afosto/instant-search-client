import { SESSION_KEY } from '../constants';
import uuid from '../utils/uuid';

const getSessionID = () => {
  const isBrowser = typeof window !== 'undefined';
  const hasSessionStorage = isBrowser && !!window.sessionStorage;

  if (!hasSessionStorage) {
    return uuid();
  }

  let sessionID = window.sessionStorage.getItem(SESSION_KEY);

  if (!sessionID) {
    sessionID = uuid();
    window.sessionStorage.setItem(SESSION_KEY, sessionID);
  }

  return sessionID;
};

export default getSessionID;
