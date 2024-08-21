
export const capitalizeFirstLetter = (message) => {
    if (typeof message !== 'string' || message.length === 0) {
        return message; 
    }
    return message.charAt(0).toUpperCase() + message.slice(1);
};
