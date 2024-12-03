'use client';
import { FC, useState, createContext, ReactNode } from 'react';
import SuccessMessage from '../components/Feedback/SuccessMessage';
import { SuccessContextType } from '../interfaces/successContextType';

// Create the context with a default value (initially undefined)
export const SuccessContext = createContext<SuccessContextType | undefined>(undefined);

interface SuccessProviderProps {
    children: ReactNode;
}

export const SuccessProvider: FC<SuccessProviderProps> = ({ children }) => {
    const [success, setSuccessState] = useState<string | null>(null);

    const setSuccess = (message: string) => {
        setSuccessState(message);
        setTimeout(() => {
            setSuccessState(null);
        }, 5000);
    };

    return (
        <SuccessContext.Provider value={{ setSuccess }}>
            {success && <SuccessMessage message={success} />}
            {children}
        </SuccessContext.Provider>
    );
};
