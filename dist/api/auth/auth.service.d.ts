import { UserRole } from '@prisma/client';
export declare const registerUser: (data: {
    username: string;
    password: string;
    email: string;
    phone: string;
    role: UserRole;
}) => Promise<{
    userId: string;
    username: string;
    role: import(".prisma/client").$Enums.UserRole;
}>;
export declare const loginUser: (username: string, password: string) => Promise<{
    token: string;
    refreshToken: string;
    user: {
        userId: string;
        username: string;
        email: string | null;
        role: import(".prisma/client").$Enums.UserRole;
    };
}>;
export declare const logoutUser: (userId: string) => Promise<void>;
export declare const refreshToken: (token: string) => Promise<{
    token: string;
}>;
export declare const getCurrentUser: (userId: string) => Promise<{
    id: string;
    username: string;
    email: string | null;
    phone: string | null;
    role: import(".prisma/client").$Enums.UserRole;
    isActive: boolean;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}>;
export declare const changePassword: (userId: string, oldPass: string, newPass: string) => Promise<void>;
export declare const updateProfile: (userId: string, data: {
    email?: string;
    phone?: string;
}) => Promise<{
    id: string;
    username: string;
    email: string | null;
    phone: string | null;
    role: import(".prisma/client").$Enums.UserRole;
    isActive: boolean;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}>;
export declare const forgotPassword: (email: string) => Promise<{
    message: string;
}>;
export declare const resetPassword: (token: string, newPass: string) => Promise<void>;
