// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { auth } from '@/app/firebase/config';
import firebase from 'firebase/app';

interface CustomUser {
  uid: string;
  email: string | null;
  displayName:string | null;
}

export function useAuth(): CustomUser | null {
  const [user, setUser] = useState<CustomUser | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in.
        setUser({
          uid: authUser.uid,
          email: authUser.email,
          displayName:authUser.displayName
        });
      } else {
        // User is signed out.
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return user;
}
