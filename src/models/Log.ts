import { LogStatus } from "./enums/LogStatus";

export interface Log {
    id: string;
    createdAt: string;
    screenId: string;
    status: LogStatus;
    text: string;
}