import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    create(user: User): Promise<User> {
        return this.usersRepository.save(user);
    }

    findOne(username: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { username } });
    }
}
