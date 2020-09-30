import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDTO {
    @IsNotEmpty({ message: `No comment to add.`})
    @IsString()
    content: string;
}