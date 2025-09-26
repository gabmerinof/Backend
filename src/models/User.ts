export interface User {
    id: string;
    email: string;
    createdAt: Date;
    lastLogin?: Date;
}

export interface CreateUserRequest {
    email: string;
}

export interface UserResponse {
    id: string;
    email: string;
    createdAt: string;
    exists: boolean;
    token: string;
}