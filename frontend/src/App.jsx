import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAppStore } from '@/stores/appStore';

function App() {
    const checkAuth = useAppStore(state => state.checkAuth);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
