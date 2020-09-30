import { Repository, EntityRepository } from "typeorm";
import { Comments } from "src/database/entities/comment.entity";
import { NotFoundException } from "@nestjs/common";


@EntityRepository(Comments)
export class CommentRepository extends Repository<Comments> {

    public async viewCommentById(id: string): Promise<Comments> {
        const viewComment: Comments = await this.findOne({ where: { id, isDeleted: false }});

        if (!viewComment) {
            throw new NotFoundException(`Comment does not exist`);
        }

        return viewComment;
    }
}
