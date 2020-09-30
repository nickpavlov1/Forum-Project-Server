import { IsOptional, IsString } from "class-validator";

export class UpdatePostDTO {
    @IsOptional()
    @IsString()
    title: string;
    @IsOptional()
    @IsString()
    content: string;
}