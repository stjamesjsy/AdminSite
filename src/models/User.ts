import { UserRole } from "./enums/UserRole";

export interface User {
    id: string;
    createdAt: string;
    name: string;
    username: string;
    password: string;
    isSuperAdmin: boolean;
    isActive: boolean;
    role: UserRole;
}