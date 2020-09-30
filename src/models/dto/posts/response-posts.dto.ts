import { Expose } from 'class-transformer'

export class ResponsePostDTO {
    @Expose()
    id: string;
    @Expose()
    title: string;
    @Expose()
    content: string;

    @Expose()
    author: string;

    @Expose()
    updateDate: Date;

    @Expose()
    editor: string
}
