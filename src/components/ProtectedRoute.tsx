import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] bg-[#faf9f5] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-stone-300 border-t-[#c5a880] rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-stone-500">Preparing your private collection</p>
        </div>
      </div>
    );
  }

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />;
};

export const AdminRoute: React.FC = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-[60vh] bg-[#faf9f5] animate-pulse" aria-label="Loading secure account" />;
  }
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return isAdmin ? <Outlet /> : <Navigate to="/account" replace />;
};
