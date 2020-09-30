import { Expose } from "class-transformer";

export class ResponseCommentDTO {
    @Expose()
    id: string;

    @Expose()
    content: string;

    @Expose()
    isDeleted: boolean;

    @Expose()
    dateCreated: Date;
    
    @Expose()
    author: string;

    @Expose()
    editor: string
}