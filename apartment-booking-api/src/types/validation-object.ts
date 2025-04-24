import {ResponseObject} from "../utils/response";

export interface ValidationObject {
    valid: boolean;
    response: ResponseObject | null;
}