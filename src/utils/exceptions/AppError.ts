import { HttpCode } from "./HttpCode";

interface AppErrorArgs {
    name?: string;
    httpCode: HttpCode;
    description: string;
}

export class AppError extends Error {
    public readonly name: string;
    public readonly httpCode: HttpCode;

    constructor(args: AppErrorArgs) {
        super(args.description);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = args.name || "Server Error";
        this.httpCode = args.httpCode;
    }
}

export { HttpCode }