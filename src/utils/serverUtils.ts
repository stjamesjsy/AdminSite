import { checkUserRoleLower, UserRole } from "../models/enums/UserRole";
import { ADMIN_API_KEY, API_KEY } from "./constants";
import { AppError } from "./exceptions/AppError";

/**
 * Processes a server-side error and prepares props for the client.
 */
export function processServerError(error: Error | AppError | any, session: any) {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorObject = error instanceof AppError ? error : new AppError({
        httpCode: 500,
        description: errorMessage
    });

    console.error(`(${errorObject.httpCode}): ${errorMessage}`);

    return {
        props: {
            session: JSON.parse(JSON.stringify(session)),
            error: JSON.parse(JSON.stringify(errorObject, Object.getOwnPropertyNames(errorObject)))
        }
    }
}

/**
 * Ensures the user is authenticated and has sufficient permissions.
 */
export function checkAuthenticated(session: any, role: UserRole) {
    if (!session) {
        return {
            redirect: { destination: "/login", permanent: false }
        }
    }
    if (!session?.user?.isSuperAdmin && checkUserRoleLower(session?.user?.role, role)) {
        throw new Error("You do not have permission to view this page");
    }
    return true;
}

/**
 * Returns the appropriate API key for the current session.
 */
export function getApiKey(session: any) {
    if (!session || session?.user?.role === UserRole.NONE) {
        return null;
    }
    if (session?.user?.role === UserRole.ADMIN || session?.user?.isSuperAdmin) {
        return ADMIN_API_KEY;
    }
    return API_KEY;
}