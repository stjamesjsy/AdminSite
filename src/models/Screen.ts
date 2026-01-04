import { DeviceType } from "./enums/DeviceType";

export interface Screen {
    id: string;
    createdAt: string;
    uniqueCode: string;
    name: string;
    deviceType: DeviceType;
    activeVideoId: string | null;
    isControlsShown: boolean;
    isTimeShown: boolean;
}