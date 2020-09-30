import { IsString, IsNotEmpty } from "class-validator";

export class UpdateCommentDTO {
    @IsString()
    @IsNotEmpty({ message: 'Please, provide text to update comment'})
    content: string;
}