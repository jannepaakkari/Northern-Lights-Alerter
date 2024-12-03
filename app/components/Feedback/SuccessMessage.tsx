import { FC } from "react";

type SuccessMessageProps = {
    message: string | null;
};

const SuccessMessage: FC<SuccessMessageProps> = ({ message }) => {
    if (!message) return null;

    return (
        <div className="flex items-center gap-3 p-4 text-white bg-green-500 rounded-lg shadow-md">
            <p className="text-sm md:text-base">{message}</p>
        </div>
    );
};

export default SuccessMessage
