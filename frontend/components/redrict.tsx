import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
const Redirect: React.FC = () => {
    const router = useRouter();

    const handleLogin = () => {
        console.log('Login button clicked');
        router.push('/profile');
    };

    return (
        <div>
            <p>You must log in to access this content.</p>
            <Button onClick={handleLogin}>Login</Button>
        </div>
    );
};

export default Redirect;
