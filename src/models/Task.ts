export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}

export interface Timestamp {
    _seconds: number,
    _nanoseconds: number
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    userId: string;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    completed?: boolean;
}

export interface TaskResponse {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
}