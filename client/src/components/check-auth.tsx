import React, { useEffect, useState } from "react";
import type { ReactNode } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface CheckAuthProps {
    children: ReactNode;
    protected: boolean;
}

const FullPageLoader: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <div className="space-y-4 w-full max-w-md">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-20 w-full" />
            </div>
            <p className="text-muted-foreground mt-4">Loading your experience...</p>
        </div>
    );
};


function CheckAuth({ children, protected: isProtectedRoute }: CheckAuthProps) {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (isProtectedRoute) {
            if (!token) {
                navigate("/login", { state: { from: location }, replace: true });
            } else {
                setIsAuthenticating(false);
            }
        } else {
            if (token) {
                const from = location.state?.from?.pathname || "/";
                navigate(from, { replace: true });
            } else {
                setIsAuthenticating(false);
            }
        }
    }, [navigate, isProtectedRoute, location.pathname]);

    if (isAuthenticating) {
        return <FullPageLoader />;
    }

    return <>{children}</>;
}

export default CheckAuth;