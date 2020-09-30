import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreatePostDTO {

    @MaxLength(120)
    @IsNotEmpty()
    @IsString()
    title: string;

    @MaxLength(500)
    @IsNotEmpty()
    @IsString()
    content: string;

}