'use client';

import { useState, useEffect } from 'react';
import { auth } from '../firebase/firebase';
import { signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';

export default function Auth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <div className="p-4">
      {user ? (
        <div>
          <p>Welcome, {user.displayName}</p>
          <button onClick={signOut} className="bg-red-500 text-white p-2 rounded">
            Sign Out
          </button>
        </div>
      ) : (
        <button onClick={signIn} className="bg-blue-500 text-white p-2 rounded">
          Sign In with Google
        </button>
      )}
    </div>
  );
}