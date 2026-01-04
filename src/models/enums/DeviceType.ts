export enum DeviceType {
    UNKNOWN = "UNKNOWN",
    COMPUTER = "COMPUTER",
    TABLET = "TABLET",
    FIRE_STICK = "FIRE_STICK",
    ANDROID_TV = "ANDROID_TV",
    OTHER = "OTHER"
}

export function formatDeviceType(type: DeviceType) {
    switch (type) {
        case DeviceType.UNKNOWN: return "Unknown";
        case DeviceType.COMPUTER: return "Computer";
        case DeviceType.TABLET: return "Tablet";
        case DeviceType.FIRE_STICK: return "Fire TV Stick";
        case DeviceType.ANDROID_TV: return "Android TV";
        case DeviceType.OTHER: return "Other";
    }
    return "Unknown";
}