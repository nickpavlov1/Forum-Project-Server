import { Repository, EntityRepository } from 'typeorm';
import { Posts } from '../database/entities/post.entity';
import { NotFoundException } from '@nestjs/common';


@EntityRepository(Posts)
export class PostRepository extends Repository<Posts> {

    public async viewPostById(id: string): Promise<Posts> {
        const foundPost: Posts = await this.findOne({ where: { id, isDeleted: false }});
            if (!foundPost) {
            throw new NotFoundException(`Post does not exist.`);
            }
        return foundPost;
    }
}