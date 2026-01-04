import Joi from "joi";
import { useState } from "react";

type JoiError = {
    key: string;
    message: string;
}

const validationErrorSchema = Joi.object({
    code: Joi.number().required(),
    error: Joi.string().required(),
    details: Joi.string().optional()
});

export default function useErrorHandling() {
    const [errors, setErrors] = useState<JoiError[]>([]);

    function findErrorMessage(key: string) {
        const error = errors.find((error) => error.key === key);
        return error ? error.message : null;
    }

    function clearError(key: string) {
        setErrors((prevErrors) => prevErrors.filter((error) => error.key !== key));
    }

    // Helper method that makes it easier to call two methods on one line
    const clearErrorAndRun = (key: string, callback: () => void) => {
        clearError(key);
        callback();
    }

    function clearErrors() {
        setErrors([]);
    }

    async function handleApiError(response: Response) {
        if (response.status !== 200) {
            let json
            ;
            try {
                json = await response.json();
            } catch (e: any) {
                // ignore
            }
            const localErrors: JoiError[] = [];

            if (!json) {
                throw new Error(`An unknown error has occurred (${response.status})`);
            }
            if (!validationErrorSchema.validate(json)) {
                throw new Error("Invalid error response");
            }
            if (json.details) {
                json.details.forEach((error: any) => {
                    localErrors.push({
                        key: error.context.key,
                        message: error.message,
                    });
                });
                setErrors(localErrors);
                return;
            }
            throw new Error(json?.error);
        } else {
            // success
            return true;
        }
    }

    return { errors, findErrorMessage, clearError, clearErrorAndRun, clearErrors, handleApiError };
}