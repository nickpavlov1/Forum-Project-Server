import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BanRepository } from './ban-status.repository';
import { UserRepository } from '../users/user.repository';
import { BanStatus } from '../database/entities/ban.entity';
import { plainToClass } from 'class-transformer';
import { BanStatusDTO } from '../models/dto/ban/ban-status.dto';
import { SetBanStatusDTO } from '../models/dto/ban/set-ban-status.dto';
import { PostLockChangeDTO } from '../models/dto/posts/lock-change-post.dto';
import { PostRepository } from '../posts/post.repository';
import { Posts } from '../database/entities/post.entity';
import { Users } from '../database/entities/user.entity';
import { UserDTO } from '../models/dto/users/user.dto';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(BanRepository)
        private readonly banRepository: BanRepository,
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
        @InjectRepository(PostRepository)
        private readonly postRepository: PostRepository,
        ){}

        public async banUser(id: string, banOrder: SetBanStatusDTO): Promise<BanStatusDTO> {
            const { description, expDate } = banOrder;
            const targetUser = await this.userRepository.findOne({
                where: { id: id, isDeleted: false }
            });
            
            if (!targetUser) {
                throw new BadRequestException('No user in DB matches requirements');
            }
            const targetBanStatus = targetUser.banStatus;
            if (targetBanStatus.isBanned) {
                throw new BadRequestException(`User is already banned`);
            }
            targetBanStatus.isBanned = true;
            targetBanStatus.description = description;
            targetBanStatus.expDate = new Date(expDate);

            const commitBanOrder: BanStatus = await this.banRepository.save(targetBanStatus);

                return plainToClass(BanStatusDTO, { ...commitBanOrder, id: id }, { excludeExtraneousValues: true });
        }

        public async unbanUser(id: string): Promise<BanStatusDTO> {
            const targetUser: Users = await this.userRepository.findOne({
                where: { id: id, isDeleted: false }
            });

            if (!targetUser) {
                throw new BadRequestException(`No user in DB matches requirements`);
            }
            const targetBanStatus: BanStatus = targetUser.banStatus;

            if (!targetBanStatus.isBanned) {
                throw new BadRequestException(`User is not banned`);
            }
            targetBanStatus.isBanned = false;
            targetBanStatus.description = null;
            targetBanStatus.expDate = null;

            const commitBanOrder: BanStatus = await this.banRepository.save(targetBanStatus);

                return plainToClass(BanStatusDTO, { ...commitBanOrder, id: id }, { excludeExtraneousValues: true });
        }

        public async lockPost(id: string): Promise<PostLockChangeDTO> {
            const targetPost: Posts = await this.postRepository.findOne({
                where: { id: id, isDeleted: false }
            });

            if (!targetPost) {
                throw new BadRequestException(`Post does not exist in the DB`);
                }
            if (targetPost.isLocked) {
                throw new BadRequestException(`Post is already locked`);
                }
            targetPost.isLocked = true;
            const lockPost: PostLockChangeDTO = await this.postRepository.save(targetPost);

                return plainToClass(PostLockChangeDTO, lockPost, { excludeExtraneousValues: true });
            
        }

        public async unlockPost(id: string): Promise<PostLockChangeDTO> {
            const targetPost: Posts = await this.postRepository.findOne({
                where: { id: id, isDeleted: false }
            });

            if (!targetPost) {
               throw new BadRequestException(`Post does not exist in the DB`);
               }
            if (!targetPost.isLocked) {
               throw new BadRequestException(`Post is already unlocked`);
               }
            targetPost.isLocked = false;
            const lockPost: PostLockChangeDTO = await this.postRepository.save(targetPost);

               return plainToClass(PostLockChangeDTO, lockPost, { excludeExtraneousValues: true });
       }

        public async deleteUser(id: string): Promise<UserDTO> {

             const targetUser: Users = await this.userRepository.findOne({ 
                where: { id: id, isDeleted: false }
            });

            if (!targetUser) {
                throw new BadRequestException(`User is not found in the DB`);
            }

            const deleteTargetUser = await this.userRepository.save({ ...targetUser, isDeleted: true });

            const deletedUser = plainToClass(UserDTO, deleteTargetUser, { excludeExtraneousValues: true });
           
            return deletedUser;

        }
   }    
