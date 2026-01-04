import { useEffect, useState } from "react";

// TODO: Unused, remove?
export default function useAdminSessionId() {
    const [sessionId, setSessionId] = useState("");

    useEffect(() => {
        const sessionId = sessionStorage.getItem("adminSessionId");

        if (sessionId !== null && sessionId !== undefined) {
            setSessionId(sessionId);
        }
    }, []);
    return sessionId;
}