import { Expose } from "class-transformer";
import { IsBoolean } from "class-validator";

export class PostLockChangeDTO {
    
    @Expose()
    @IsBoolean()
    isLocked: boolean;
}