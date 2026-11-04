import { USER_SESSION_KEY } from '../constants';
import { uuid } from './uuid';

export const getUserID = (): string => {
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
