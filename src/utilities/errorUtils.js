
export const getErrorMessage = (error) => {
    return (
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        error.toString() ||
        error.request?.toString() ||
        "Something went wrong"
    );
};
