//Todo.tsx

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(); // Get the Firebase Auth instance

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in, get the user ID
        setUserId(user.uid);
      } else {
        // User is not logged in
        setUserId(null);
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return userId;
};

export default useUserId;
