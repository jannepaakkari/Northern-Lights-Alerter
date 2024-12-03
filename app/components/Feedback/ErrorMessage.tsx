import { FC } from "react";

type ErrorMessageProps = {
    message: string | null;
};

const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => {
    if (!message) return null;

    return (
        <div className="flex items-center gap-3 p-4 text-white bg-red-500 rounded-lg shadow-md">
            <p className="text-sm md:text-base">{message}</p>
        </div>
    );
};

export default ErrorMessage;
