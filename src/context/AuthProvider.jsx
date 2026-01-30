import React, { useState, useCallback, useMemo } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return token ? { token, username } : null;
    });

    const login = useCallback((token, username) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        setUser({ token, username });
    }, []);

    const logout = useCallback(() => {
        localStorage.clear();
        setUser(null);
    }, []);

    const value = useMemo(() => ({
        user,
        login,
        logout,
        isAuthenticated: !!user
    }), [user, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};