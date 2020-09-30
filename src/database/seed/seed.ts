import { createConnection, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BanStatus } from '../entities/ban.entity';
import { Users } from '../entities/user.entity';
import { UserRole } from '../../models/enums/user-roles.enum';
import { Comments } from '../entities/comment.entity';
import { Posts } from '../entities/post.entity';
import { Votes } from '../entities/vote.entity';
  


const main = async () => {
    const connection = await createConnection({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'forum',
            entities: [ "./src/database/entities/**/*.ts" ],
        });

    const userRepository: Repository<Users> = connection.manager.getRepository(Users)
    const banRepository: Repository<BanStatus> = connection.manager.getRepository(BanStatus);
      
    const nikolay = await userRepository.findOne({
      where: {
        username: 'nick',
      },
    });

    if (!nikolay) {
    const admin = new Users();
    admin.username = 'nick';
    admin.salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash('AdminPassword123!', admin.salt);
    admin.password = passwordHash;
    admin.email = 'nikolay@pavlov.bg';
    admin.firstname = 'Nikolay';
    admin.lastname = 'Pavlov';
    admin.role = UserRole.admin;
    await userRepository.save(admin);
    const banStatus = new BanStatus();
    banStatus.user = Promise.resolve(admin);
    await banRepository.save(banStatus);
    } else {
      console.log(`Admin is in the database.`);
    }
    await connection.close();
}

main().catch(console.error);