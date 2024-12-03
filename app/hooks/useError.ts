import { useContext } from 'react';
import { ErrorContext } from '../providers/ErrorProvider';
import { ErrorContextType } from '../interfaces/errorContextType';

// Custom hook to access the ErrorContext
export const useError = (): ErrorContextType => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
};
