import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@context/auth-context';
import Loading from '@components/layouts/loading-layout';

export default function ProtectedRoute () {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loading />;
    }
    
    if(!user) {
        return <Navigate to='/' replace />;
    }

    return <Outlet />;
}