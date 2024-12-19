export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Is probably not a valid e-mail address if it's longer than 254 characters
    if (email.length > 254) {
        return false;
    }
    return emailRegex.test(email);
};