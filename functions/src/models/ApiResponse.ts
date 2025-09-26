export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export const createSuccessResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
});

export const createErrorResponse = (error: string, message?: string): ApiResponse<null> => ({
  success: false,
  error,
  message: message || undefined,
});
