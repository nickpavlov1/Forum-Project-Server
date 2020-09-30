import { Expose } from "class-transformer";
export class BanStatusDTO {
    @Expose()
    id: string;

    @Expose()
    description?: string;

    @Expose()
    isBanned: boolean;

    @Expose()
    user: string;

    @Expose()
    expDate?: Date;
}