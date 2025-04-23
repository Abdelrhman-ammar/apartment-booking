import { statusCodes } from "../utils/status-responses.js";
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

export const sendGeneralErrorResponse = (res) => {
    const status = statusCodes.INTERNAL_SERVER_ERROR
    res.status(status).json(generateResponse({
        status,
        error: "General Error"
    }));
}