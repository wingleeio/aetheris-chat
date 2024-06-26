import { AetherisError } from "@aetheris/server";

export class ApiError extends AetherisError {
    constructor(status: number, message: string, data?: any) {
        super({
            status,
            message,
            data,
        });
    }
}
