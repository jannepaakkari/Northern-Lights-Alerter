import { useState, useCallback } from 'react';

const usePost = <T>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const makeRequest = useCallback(async (body: Record<string, unknown>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            // Handle 400 status code separately to show the error to the user.
            if (response.status === 400) {
                const errorResult = await response.json();
                setData(errorResult);
                return;
            }

            const result: T = await response.json();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [url]);

    return [{ data, isLoading, error }, makeRequest] as const;
};

export default usePost;