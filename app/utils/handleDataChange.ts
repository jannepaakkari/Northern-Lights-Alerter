export const handleDataChange = (data: any, prevData: any, setSuccess: Function, setError: Function) => {
    if (prevData !== data) {
        if (data?.result === 'ok') {
            setSuccess(data?.message ?? 'Success');
        } else {
            setError(data?.message ?? 'Error: Something went wrong.');
        }
    }
};