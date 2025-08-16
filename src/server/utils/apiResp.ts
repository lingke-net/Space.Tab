export default class ApiResponse<T = null> {
    constructor(
        public code: number = 200,
        public status: string = "success",
        public message: string = "Request Success",
        public data?: T
    ) { }

    static success(code: number, message: string): ApiResponse<null>;
    static success<T>(code: number, message: string, data: T): ApiResponse<T>;
    static success<T = null>(code: number = 200, message: string = "Request Success", data?: T): ApiResponse<T> {
        return new ApiResponse(code, "success", message, data);
    }

    static error(code: number, message: string): ApiResponse<null>;
    static error<T>(code: number, message: string, data: T): ApiResponse<T>;
    static error<T = null>(code: number = 500, message: string = "Internal Server Error", data?: T): ApiResponse<T | null> {
        return new ApiResponse(code, "error", message, data);
    }
}    