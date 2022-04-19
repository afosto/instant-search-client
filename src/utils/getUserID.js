import { USER_SESSION_KEY } from '../constants';
import uuid from '../utils/uuid';

const getUserID = () => {
  const isBrowser = typeof window !== 'undefined';
  const hasSessionStorage = isBrowser && !!window.sessionStorage;

  if (!hasSessionStorage) {
    return uuid();
  }

  let userSessionID = window.sessionStorage.getItem(USER_SESSION_KEY);

  if (!userSessionID) {
    userSessionID = uuid();
    window.sessionStorage.setItem(USER_SESSION_KEY, userSessionID);
  }

  return userSessionID;
};

export default getUserID;
