import { useContext } from 'react';
import { SuccessContext } from '../providers/SuccessProvider';
import { SuccessContextType } from '../interfaces/successContextType';

// Custom hook to access the SuccessContext
export const useSuccess = (): SuccessContextType => {
    const context = useContext(SuccessContext);
    if (!context) {
        throw new Error('useSuccess must be used within an SuccessProvider');
    }
    return context;
};
