export const generateResponse = ({status, message = null, error = null, data}) => {
    const response = {
        success: status < 300? true : false,
        status
    };
    if (message) response.message = message;
    if (error) response.error = error;
    if (data) response.data = data;
    return response
};