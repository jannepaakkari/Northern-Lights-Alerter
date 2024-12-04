export const formatTime = (inputDate: string): string => {
    // Parse the input string into a Date object
    const date: Date = new Date(inputDate);

    if (isNaN(date.getTime())) {
        return inputDate;
    }

    // Format the date (en because fi puts Finnish otherwise English site)
    const formattedDate: string = date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).replace(',', '');

    return formattedDate;
}
