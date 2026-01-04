export enum UserRole {
    NONE = "NONE",
    USER = "USER",
    ADMIN = "ADMIN"
}

const roleToInt = {
    [UserRole.NONE]: 0,
    [UserRole.USER]: 1,
    [UserRole.ADMIN]: 2
}

export function checkUserRoleLower(userRole: UserRole, requiredRole: UserRole) {
    if (!userRole) {
        return false;
    }
    const userRoleInt = roleToInt[userRole];
    const requiredRoleInt = roleToInt[requiredRole];

    if (userRoleInt < requiredRoleInt) {
        return true;
    }
    return false;
}

export function formatUserRole(role: UserRole) {
    switch (role) {
        case UserRole.NONE: return "None";
        case UserRole.USER: return "User";
        case UserRole.ADMIN: return "Admin";
    }
    return "Unknown";
}