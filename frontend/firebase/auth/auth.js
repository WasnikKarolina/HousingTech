
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import  firebase_app  from '../config';

const auth = getAuth(firebase_app);

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
};

export const IsAuthenticated = () => {
    const { user, loading } = useAuth();
    return !!user && !loading;
};
