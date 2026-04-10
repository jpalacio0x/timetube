import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase';

export function useAuth() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = signed out
  const [error, setError] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(
      auth,
      (u) => setUser(u),
      (err) => {
        setError(err);
        setUser(null);
      }
    );
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      setError(e);
      throw e;
    }
  }, []);

  const logout = useCallback(() => signOut(auth), []);

  return useMemo(
    () => ({
      user,
      loading: user === undefined,
      isAuthed: !!user,
      loginWithGoogle,
      logout,
      error,
    }),
    [user, error, loginWithGoogle, logout]
  );
}
