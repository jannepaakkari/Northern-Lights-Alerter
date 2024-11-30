import { useState, useCallback, useRef } from 'react';

const useGet = <T>(url: string, autoFetch: boolean) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // autoFetch will be run just once
    const hasFetchedRef = useRef(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: T = await response.json();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [url]);

    if (autoFetch && !hasFetchedRef.current) {
        hasFetchedRef.current = true;
        fetchData();
    }

    return [{ data, isLoading, error }, fetchData] as const;
};

export default useGet;
