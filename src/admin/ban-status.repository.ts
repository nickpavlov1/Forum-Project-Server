import { BanStatus } from '../database/entities/ban.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(BanStatus)
export class BanRepository extends Repository<BanStatus> {

}