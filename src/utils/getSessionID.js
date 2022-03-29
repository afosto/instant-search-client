import { v4 as uuid } from 'uuid';
import { SESSION_KEY } from '../constants';

const getSessionID = () => {
  const hasSessionStorage = !!window.sessionStorage;

  if (!hasSessionStorage) {
    return uuid();
  }

  let sessionID = sessionStorage.getItem(SESSION_KEY);

  if (!sessionID) {
    sessionID = uuid();
    sessionStorage.setItem(SESSION_KEY, sessionID);
  }

  return sessionID;
};

export default getSessionID;
