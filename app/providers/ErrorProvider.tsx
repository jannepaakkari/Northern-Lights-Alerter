'use client';
import { FC, useState, createContext } from 'react';
import ErrorMessage from '../components/Feedback/ErrorMessage';
import { ErrorContextType } from '../interfaces/errorContextType';

// Create the context with a default value (initially undefined)
export const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
    children: React.ReactNode;
}

export const ErrorProvider: FC<ErrorProviderProps> = ({ children }) => {
    const [error, setErrorState] = useState<string | null>(null);

    const setError = (message: string) => {
        setErrorState(message);
        setTimeout(() => {
            setErrorState(null);
        }, 5000);
    };

    return (
        <ErrorContext.Provider value={{ setError }}>
            {error && <ErrorMessage message={error} />}
            {children}
        </ErrorContext.Provider>
    );
};
